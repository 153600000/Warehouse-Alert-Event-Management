import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Clock,
  Calendar,
  Layers,
  Activity,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Boxes
} from 'lucide-react';
import { usePeriodicalFetch } from '../hooks/usePeriodicalFetch';
import { useToastStore } from '../store/toastStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';

interface SummaryResponse {
  summary: {
    avgAmbientTemp: number;
    avgColdStorageTemp: number;
    totalPackagesToday: number;
    activeRobots: number;
    conveyorHealthIndex: number;
    totalEventsLast10Min: number;
    criticalCount: number;
    warningCount: number;
    trend: {
      throughputDelta: number;
      direction: 'UP' | 'DOWN';
      energyEfficiency: string;
    };
  };
  zones: Array<{
    id: string;
    name: string;
    status: string;
    throughput: string;
    temp: string;
  }>;
  lastUpdated: string;
}

interface HistoryResponse {
  range: string;
  history: Array<{
    timestamp: string;
    formattedTime: string;
    ambientTemp: number;
    coldStorageTemp: number;
    conveyorLoad: number;
    throughput: number;
    humidity: number;
  }>;
  lastUpdated: string;
}

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('1h');
  const { addToast } = useToastStore();

  // Periodic Polling (every 10 seconds) for aggregated summary
  const {
    data: summaryData,
    isLoading: summaryLoading,
    isRefetching: summaryRefetching,
    lastUpdated: summaryUpdated,
    refetch: refetchSummary,
  } = usePeriodicalFetch<SummaryResponse>({
    url: '/api/dashboard/summary',
    intervalMs: 10000,
  });

  // Fetch historical data for charts
  const {
    data: historyData,
    isLoading: historyLoading,
    refetch: refetchHistory,
  } = usePeriodicalFetch<HistoryResponse>({
    url: `/api/dashboard/history?range=${timeRange}`,
    intervalMs: 15000,
  });

  const handleManualRefresh = async () => {
    await Promise.all([refetchSummary(), refetchHistory()]);
    addToast({
      type: 'info',
      title: 'Aggregated Data Refreshed',
      message: 'Latest warehouse analytics and zone summaries loaded.',
    });
  };

  const handleRangeChange = (range: '1h' | '24h' | '7d') => {
    setTimeRange(range);
    addToast({
      type: 'info',
      title: 'Time Window Adjusted',
      message: `Analytics charts updated to ${range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24 Hours' : 'Last 7 Days'}.`,
    });
  };

  const s = summaryData?.summary;

  return (
    <div className="page-container">
      {/* Header & Periodic Info */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Historical Analytics & Aggregated Trends
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            <Clock size={15} />
            <span>
              Periodic Refresh (every 10s) &bull; Last Synced: <strong>{new Date(summaryUpdated).toLocaleTimeString()}</strong>
            </span>
          </div>
        </div>

        {/* Controls: Time range & manual refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.2rem',
          }}>
            {(['1h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: timeRange === r ? 700 : 500,
                  backgroundColor: timeRange === r ? 'var(--color-primary)' : 'transparent',
                  color: timeRange === r ? '#ffffff' : 'var(--color-text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {r === '1h' ? '1 Hour' : r === '24h' ? '24 Hours' : '7 Days'}
              </button>
            ))}
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={summaryRefetching}
            className="btn btn-secondary"
            style={{ boxShadow: 'var(--shadow-sm)' }}
          >
            <RefreshCw size={15} className={summaryRefetching ? 'animate-spin' : ''} />
            <span>{summaryRefetching ? 'Polling...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Aggregated Summary KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}>
        {/* KPI 1 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              10-Min Avg Ambient
            </span>
            <Activity size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {s ? `${s.avgAmbientTemp}°C` : '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={13} color="var(--color-success)" /> Within target parameters (20°C - 24°C)
          </div>
        </div>

        {/* KPI 2 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Total Processed Today
            </span>
            <Boxes size={16} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {s ? s.totalPackagesToday.toLocaleString() : '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {s?.trend.direction === 'UP' ? (
              <TrendingUp size={13} color="var(--color-success)" />
            ) : (
              <TrendingDown size={13} color="var(--color-warning)" />
            )}
            <span style={{ fontWeight: 600, color: s?.trend.direction === 'UP' ? 'var(--color-success)' : 'var(--color-warning)' }}>
              {s ? `${s.trend.throughputDelta}% delta` : ''}
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              Conveyor Line Health
            </span>
            <Zap size={16} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {s ? `${s.conveyorHealthIndex}%` : '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
            Optimal mechanical tension & speed
          </div>
        </div>

        {/* KPI 4 */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
              System Alert Severity
            </span>
            <AlertTriangle size={16} color="var(--color-error)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ color: 'var(--color-error)' }}>{s?.criticalCount ?? 0}</span>
            <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>/</span>
            <span style={{ color: 'var(--color-warning)' }}>{s?.warningCount ?? 0}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
            Critical / Warning events in window
          </div>
        </div>
      </div>

      {/* Main Historical Visualizations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '1.5rem',
        marginBottom: '1.75rem',
      }}>
        {/* Chart 1: Area Chart (Throughput & Payload trends) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Package Ingestion & Throughput Density</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Derived volume across time window ({timeRange})
              </p>
            </div>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData?.history || []}>
                <defs>
                  <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                <XAxis dataKey="formattedTime" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="throughput"
                  name="Throughput (units/min)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorThroughput)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Multi-Zone Temperature Analysis */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Thermal Variance & Cold Chain Integrity</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                Ambient Staging (°C) vs Cold Vault (°C)
              </p>
            </div>
          </div>

          <div style={{ height: 280, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData?.history || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.6} />
                <XAxis dataKey="formattedTime" stroke="var(--color-text-muted)" fontSize={11} />
                <YAxis stroke="var(--color-text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line
                  type="monotone"
                  dataKey="ambientTemp"
                  name="Ambient Temp (°C)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="coldStorageTemp"
                  name="Cold Vault (°C)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Facility Zone Breakdown Table */}
      <div className="card">
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Warehouse Sorting Zones</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            Real-time operational status derived via periodic telemetry aggregation
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Zone Identifier</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Zone Name</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Current Status</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Local Throughput</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>Thermal Reading</th>
              </tr>
            </thead>
            <tbody>
              {(summaryData?.zones || [
                { id: 'Z-01', name: 'Intake Bay A', status: 'Optimal', throughput: '84 pk/m', temp: '21.5°C' },
                { id: 'Z-02', name: 'Cold Chain Vault', status: 'Optimal', throughput: '42 pk/m', temp: '-18.1°C' },
                { id: 'Z-03', name: 'High-Speed Conveyor 4', status: 'Heavy Load', throughput: '115 pk/m', temp: '24.2°C' },
                { id: 'Z-04', name: 'Automated Stacker Cranes', status: 'Optimal', throughput: '68 pk/m', temp: '22.0°C' },
              ]).map((zone) => (
                <tr key={zone.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{zone.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{zone.name}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span className={`badge ${zone.status === 'Optimal' ? 'badge-success' : 'badge-warning'}`}>
                      {zone.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)' }}>{zone.throughput}</td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)' }}>{zone.temp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
