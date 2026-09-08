import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radio,
  Play,
  Pause,
  RefreshCw,
  Gauge,
  Thermometer,
  Snowflake,
  Droplets,
  Package,
  Zap,
  SlidersHorizontal,
  Activity,
  AlertTriangle,
  History,
  Trash2
} from 'lucide-react';
import { useWebSocket, TelemetryPayload } from '../hooks/useWebSocket';
import { LiveMetricsCard } from '../components/LiveMetricsCard';
import { AlertModal, AlertDetailItem } from '../components/AlertModal';
import { useToastStore } from '../store/toastStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    data: liveData,
    history,
    isConnected,
    isPaused,
    pause,
    resume,
    changeSpeed,
    lastMessageTime,
  } = useWebSocket();

  const { addToast } = useToastStore();
  const [selectedAlert, setSelectedAlert] = useState<AlertDetailItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [streamRate, setStreamRate] = useState(1000);
  const [eventLogs, setEventLogs] = useState<Array<{ time: string; event: string; status: string; temp: number }>>([]);

  // Accumulate live event updates into local stream log
  React.useEffect(() => {
    if (liveData) {
      setEventLogs((prev) => [
        {
          time: new Date(liveData.timestamp).toLocaleTimeString(),
          event: liveData.event,
          status: liveData.status,
          temp: liveData.metrics.ambientTemperature,
        },
        ...prev.slice(0, 19),
      ]);
    }
  }, [liveData]);

  const handleToggleStream = () => {
    if (isPaused) {
      resume();
      addToast({ type: 'success', title: 'Stream Resumed', message: 'Live telemetry ingestion is now running.' });
    } else {
      pause();
      addToast({ type: 'warning', title: 'Stream Paused', message: 'Live stream temporarily suspended by operator.' });
    }
  };

  const handleRateChange = (rate: number) => {
    setStreamRate(rate);
    changeSpeed(rate);
    addToast({
      type: 'info',
      title: 'Sampling Rate Changed',
      message: `WebSocket broadcasting frequency updated to ${rate}ms.`,
    });
  };

  const handleCardClick = (title: string, value: any, unit: string, status: any, desc: string) => {
    setSelectedAlert({
      id: `TLM-${Math.floor(1000 + Math.random() * 9000)}`,
      severity: status === 'CRITICAL' ? 'CRITICAL' : status === 'ALERT' ? 'WARNING' : 'INFO',
      source: 'Sensor Node Alpha (Zone B)',
      message: `${title} inspection: currently reading ${value} ${unit}.`,
      metric: title,
      value: `${value} ${unit}`,
      threshold: 'Standard Warehouse SOP Limits',
      timestamp: new Date().toISOString(),
      acknowledged: true,
    });
    setIsModalOpen(true);
  };

  // Format chart data from history
  const chartData = history.map((item, idx) => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    ambientTemp: item.metrics.ambientTemperature,
    coldStorage: item.metrics.coldStorageTemperature,
    load: item.metrics.conveyorLoad,
    throughput: item.metrics.packageThroughput,
  }));

  const m = liveData?.metrics;
  const status = liveData?.status || 'NOMINAL';

  return (
    <div className="page-container">
      {/* Top Banner & Stream Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Real-Time Warehouse Telemetry
            </h1>
            <div className={`live-badge ${isPaused ? 'live-paused' : ''}`}>
              <span className="live-dot" />
              <span>{isPaused ? 'STREAM PAUSED' : 'LIVE STREAM'}</span>
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Facility: <strong>{liveData?.facility || 'Zone B - East Sorting Facility'}</strong> &nbsp;|&nbsp;
            Socket Status: <span style={{ color: isConnected ? 'var(--color-success)' : 'var(--color-warning)', fontWeight: 600 }}>
              {isConnected ? 'Connected (Low Latency)' : 'Connecting...'}
            </span>
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Pause/Resume button */}
          <button
            onClick={handleToggleStream}
            className={`btn ${isPaused ? 'btn-primary' : 'btn-secondary'}`}
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            {isPaused ? (
              <>
                <Play size={16} fill="currentColor" /> Resume Stream
              </>
            ) : (
              <>
                <Pause size={16} /> Pause Stream
              </>
            )}
          </button>

          {/* Speed Selector Buttons */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem',
          }}>
            {[500, 1000, 2000].map((rate) => (
              <button
                key={rate}
                onClick={() => handleRateChange(rate)}
                style={{
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: streamRate === rate ? 700 : 500,
                  backgroundColor: streamRate === rate ? 'var(--color-primary)' : 'transparent',
                  color: streamRate === rate ? '#ffffff' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {rate >= 1000 ? `${rate / 1000}s` : `${rate}ms`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (6 Live Real-Time Metrics) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}>
        <LiveMetricsCard
          id="m-ambient"
          title="Ambient Warehouse Temp"
          value={m?.ambientTemperature ?? 22.4}
          unit="°C"
          status={m && m.ambientTemperature > 28 ? 'CRITICAL' : m && m.ambientTemperature > 26 ? 'ALERT' : 'NOMINAL'}
          delta={0.3}
          deltaLabel="vs baseline"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="Main staging & logistics hall"
          onClick={() => handleCardClick('Ambient Warehouse Temp', m?.ambientTemperature ?? 22.4, '°C', status, 'Main hall ambient sensor')}
        />

        <LiveMetricsCard
          id="m-cold"
          title="Cold Chain Vault Temp"
          value={m?.coldStorageTemperature ?? -18.2}
          unit="°C"
          status={m && m.coldStorageTemperature > -14 ? 'CRITICAL' : m && m.coldStorageTemperature > -16 ? 'ALERT' : 'NOMINAL'}
          delta={-0.2}
          deltaLabel="vs setpoint"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="Perishable pharmaceutical vault"
          onClick={() => handleCardClick('Cold Chain Vault Temp', m?.coldStorageTemperature ?? -18.2, '°C', status, 'Cold storage temperature')}
        />

        <LiveMetricsCard
          id="m-humidity"
          title="Relative Humidity"
          value={m?.humidity ?? 48.5}
          unit="% RH"
          status={m && m.humidity > 68 ? 'ALERT' : 'NOMINAL'}
          delta={0.5}
          deltaLabel="drift"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="Aisle 1-12 moisture monitoring"
          onClick={() => handleCardClick('Relative Humidity', m?.humidity ?? 48.5, '% RH', status, 'Humidity sensor array')}
        />

        <LiveMetricsCard
          id="m-conveyor"
          title="Conveyor Line Payload"
          value={m?.conveyorLoad ?? 412}
          unit="kg"
          status={m && m.conveyorLoad > 620 ? 'CRITICAL' : m && m.conveyorLoad > 580 ? 'ALERT' : 'NOMINAL'}
          delta={-8.0}
          deltaLabel="active run"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="High-speed dynamic sorter line 4"
          onClick={() => handleCardClick('Conveyor Line Payload', m?.conveyorLoad ?? 412, 'kg', status, 'Conveyor strain gauges')}
        />

        <LiveMetricsCard
          id="m-throughput"
          title="Package Ingestion Rate"
          value={m?.packageThroughput ?? 64}
          unit="units/min"
          status="NOMINAL"
          delta={4.0}
          deltaLabel="vs hourly avg"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="Automated barcode barcode readers"
          onClick={() => handleCardClick('Package Ingestion Rate', m?.packageThroughput ?? 64, 'units/min', 'NOMINAL', 'Barcode sorting rate')}
        />

        <LiveMetricsCard
          id="m-battery"
          title="AGV Robotics Fleet Power"
          value={m?.agvBattery ?? 88}
          unit="%"
          status={m && m.agvBattery < 25 ? 'CRITICAL' : m && m.agvBattery < 35 ? 'ALERT' : 'NOMINAL'}
          delta={-0.1}
          deltaLabel="drain rate"
          lastUpdated={liveData?.timestamp || new Date().toISOString()}
          description="18 Autonomous Guided Vehicles"
          onClick={() => handleCardClick('AGV Fleet Battery', m?.agvBattery ?? 88, '%', status, 'AGV telematics telemetry')}
        />
      </div>

      {/* Live Visualizations & Real-Time Event Stream */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        {/* Real-Time Live Streaming Chart */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Live Telemetry Waveform</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Real-time conveyor payload (kg) & ambient temperature (°C)
              </p>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {chartData.length} live samples
            </span>
          </div>

          <div style={{ height: 260, width: '100%', minHeight: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                <XAxis
                  dataKey="time"
                  stroke="var(--color-text-muted)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--color-text-muted)"
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="load"
                  name="Conveyor Payload (kg)"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="throughput"
                  name="Throughput (pk/m)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Event & Telemetry Log Stream */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.75rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Telemetry Event Feed</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Real-time WebSocket event frames
              </p>
            </div>
            <button
              onClick={() => setEventLogs([])}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
              title="Clear event logs"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>

          <div style={{
            flex: 1,
            maxHeight: 260,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem',
            paddingRight: '0.35rem',
          }}>
            {eventLogs.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}>
                Awaiting next live event broadcast...
              </div>
            ) : (
              eventLogs.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.65rem',
                    backgroundColor: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    fontSize: '0.785rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: item.status === 'CRITICAL' ? 'var(--color-error)' : item.status === 'ALERT' ? 'var(--color-warning)' : 'var(--color-success)',
                    }} />
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                      {item.event}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span>{item.temp}°C</span>
                    <span>{item.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Telemetry Detail Modal */}
      <AlertModal
        isOpen={isModalOpen}
        alert={selectedAlert}
        onClose={() => setIsModalOpen(false)}
        onAcknowledge={(id) => {
          addToast({
            type: 'success',
            title: 'Diagnostic Recorded',
            message: `Telemetry node verification completed for ${id}.`,
          });
        }}
      />
    </div>
  );
};
