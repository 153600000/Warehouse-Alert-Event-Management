import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

interface UsePeriodicalFetchOptions {
  url: string;
  intervalMs?: number;
  enabled?: boolean;
  onSuccess?: (data: any) => void;
}

export const usePeriodicalFetch = <T>({
  url,
  intervalMs = 10000,
  enabled = true,
  onSuccess,
}: UsePeriodicalFetchOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  const { logout } = useAuthStore();
  const abortControllerRef = useRef<AbortController | null>(null);
  const isInitialFetch = useRef(true);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const fetchData = useCallback(async (isManual = false) => {
    if (!enabled) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    if (isInitialFetch.current || isManual) {
      setIsLoading(true);
    } else {
      setIsRefetching(true);
    }

    try {
      const token = localStorage.getItem('warehouse_auth_token');
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        logout();
        throw new Error('Session has expired. Redirecting to authentication...');
      }

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: Failed to fetch data`);
      }

      const json = await response.json();
      setData(json);
      setLastUpdated(json.lastUpdated || new Date().toISOString());
      setError(null);
      if (onSuccessRef.current) onSuccessRef.current(json);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error loading periodic telemetry');
      }
    } finally {
      setIsLoading(false);
      setIsRefetching(false);
      isInitialFetch.current = false;
    }
  }, [url, enabled, logout]);

  useEffect(() => {
    isInitialFetch.current = true;
    fetchData();

    if (!enabled || intervalMs <= 0) return;

    const timer = setInterval(() => {
      fetchData();
    }, intervalMs);

    return () => {
      clearInterval(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, enabled, intervalMs]);

  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isRefetching,
    error,
    lastUpdated,
    refetch,
  };
};
