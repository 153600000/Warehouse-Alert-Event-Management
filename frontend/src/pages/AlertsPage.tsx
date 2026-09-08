import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ShieldAlert,
  AlertTriangle,
  Activity,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Eye
} from 'lucide-react';
import { usePeriodicalFetch } from '../hooks/usePeriodicalFetch';
import { AlertModal, AlertDetailItem } from '../components/AlertModal';
import { useToastStore } from '../store/toastStore';

interface AlertsApiResponse {
  alerts: AlertDetailItem[];
  totalCount: number;
  unreadCritical: number;
  lastUpdated: string;
}

type SortField = 'timestamp' | 'severity' | 'source' | 'id';
type SortOrder = 'asc' | 'desc';

export const AlertsPage: React.FC = () => {
  const { addToast } = useToastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'WARNING' | 'INFO'>('ALL');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedAlert, setSelectedAlert] = useState<AlertDetailItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  // Fetch alerts from backend
  const { data, isLoading, refetch } = usePeriodicalFetch<AlertsApiResponse>({
    url: '/api/dashboard/alerts',
    intervalMs: 12000,
  });

  const rawAlerts: AlertDetailItem[] = data?.alerts || [];
  const alerts: AlertDetailItem[] = rawAlerts.map((a) =>
    acknowledgedIds.has(a.id) ? { ...a, acknowledged: true } : a
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => new Set(prev).add(id));
    addToast({
      type: 'success',
      title: 'Alert Acknowledged',
      message: `System alert ${id} has been signed off by the active operator.`,
    });
  };

  const handleResolveAll = () => {
    const allIds = new Set(alerts.map((a) => a.id));
    setAcknowledgedIds(allIds);
    addToast({
      type: 'info',
      title: 'Batch Action Executed',
      message: 'All open warehouse alerts marked as acknowledged.',
    });
  };

  // Filter and Sort in Real-Time
  const processedAlerts = useMemo(() => {
    return alerts
      .filter((alert: AlertDetailItem) => {
        const matchesSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          !q ||
          alert.message.toLowerCase().includes(q) ||
          alert.source.toLowerCase().includes(q) ||
          alert.id.toLowerCase().includes(q) ||
          (alert.metric && alert.metric.toLowerCase().includes(q));

        return matchesSeverity && matchesSearch;
      })
      .sort((a: AlertDetailItem, b: AlertDetailItem) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'timestamp') {
          valA = new Date(a.timestamp).getTime();
          valB = new Date(b.timestamp).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [alerts, searchTerm, severityFilter, sortField, sortOrder]);

  return (
    <div className="page-container">
      {/* Page Header */}
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
            Warehouse Alert & Event Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Multi-modal event logs, sensor telemetry thresholds, and preventative maintenance triggers
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            onClick={handleResolveAll}
            className="btn btn-secondary btn-sm"
          >
            <CheckCircle2 size={15} /> Acknowledge All
          </button>
          <button
            onClick={() => refetch()}
            className="btn btn-secondary btn-sm"
            title="Reload from server"
          >
            <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 420 }}>
            <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search alert by ID, zone, metric, or message..."
              style={{ width: '100%', paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Severity Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--color-bg-primary)',
            padding: '0.2rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            gap: '0.25rem',
            flexWrap: 'wrap',
          }}>
            {(['ALL', 'CRITICAL', 'WARNING', 'INFO'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: severityFilter === sev ? 700 : 500,
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  backgroundColor: severityFilter === sev ? 'var(--color-primary)' : 'transparent',
                  color: severityFilter === sev ? '#ffffff' : 'var(--color-text-secondary)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontSize: '0.775rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}>
                <th
                  onClick={() => handleSort('severity')}
                  style={{ padding: '0.85rem 1.25rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Severity {sortField === 'severity' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('id')}
                  style={{ padding: '0.85rem 1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Alert ID {sortField === 'id' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('source')}
                  style={{ padding: '0.85rem 1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Zone Source {sortField === 'source' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
                  </div>
                </th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'left' }}>Event Description</th>
                <th
                  onClick={() => handleSort('timestamp')}
                  style={{ padding: '0.85rem 1rem', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    Timestamp {sortField === 'timestamp' ? (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />}
                  </div>
                </th>
                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {processedAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--color-text-muted)' }}>
                    No alerts match your current filter or search criteria.
                  </td>
                </tr>
              ) : (
                processedAlerts.map((alert) => (
                  <tr
                    key={alert.id}
                    onClick={() => {
                      setSelectedAlert(alert);
                      setIsModalOpen(true);
                    }}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '0.9rem 1.25rem' }}>
                      <span className={`badge badge-${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.825rem' }}>
                      {alert.id}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', fontWeight: 600 }}>
                      {alert.source}
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-text-primary)', maxWidth: 360 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {alert.message}
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 1rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlert(alert);
                          setIsModalOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      <AlertModal
        isOpen={isModalOpen}
        alert={selectedAlert}
        onClose={() => setIsModalOpen(false)}
        onAcknowledge={handleAcknowledge}
      />
    </div>
  );
};
