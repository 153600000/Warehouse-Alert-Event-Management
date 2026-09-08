import { useEffect, useRef, useState, useCallback } from 'react';

export interface TelemetryPayload {
  timestamp: string;
  metrics: {
    ambientTemperature: number;
    coldStorageTemperature: number;
    humidity: number;
    conveyorLoad: number;
    packageThroughput: number;
    agvBattery: number;
    totalProcessed: number;
  };
  status: 'NOMINAL' | 'ALERT' | 'CRITICAL';
  event: string;
  facility: string;
}

export const useWebSocket = () => {
  const [data, setData] = useState<TelemetryPayload | null>(null);
  const [history, setHistory] = useState<TelemetryPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageTime, setLastMessageTime] = useState<Date | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;

    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // If running through Vite proxy or standard host
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/live`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'STATUS' || payload.type === 'PONG') {
            return;
          }
          setData(payload);
          setLastMessageTime(new Date());
          setHistory((prev) => {
            const next = [...prev.slice(-29), payload];
            return next;
          });
        } catch (e) {
          console.warn('Failed to parse WebSocket message frame:', e);
        }
      };

      ws.onerror = () => {
        if (!isMountedRef.current) return;
        setError('Real-time connection encounter an issue. Retrying...');
      };

      ws.onclose = () => {
        if (!isMountedRef.current) return;
        setIsConnected(false);

        // Auto-reconnect with exponential backoff (up to 8s)
        const delay = Math.min(1000 * Math.pow(1.5, reconnectAttemptsRef.current), 8000);
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      };
    } catch (err: any) {
      setError(err.message || 'WebSocket connection error');
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const pause = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'pause' }));
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'resume' }));
      setIsPaused(false);
    }
  }, []);

  const changeSpeed = useCallback((intervalMs: number) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: 'speed', interval: intervalMs }));
    }
  }, []);

  return {
    data,
    history,
    isConnected,
    isPaused,
    error,
    lastMessageTime,
    pause,
    resume,
    changeSpeed,
  };
};
