import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Clock,
  Key,
  LogOut,
  Warehouse,
  MapPin,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';

export const ProfilePage: React.FC = () => {
  const { user, token, logout } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Session Terminated',
      message: 'You have been safely signed out.',
    });
    navigate('/login');
  };

  const auditActivities = [
    { action: 'Session Initialized', detail: 'Authenticated via JWT credentials', time: '14 minutes ago', status: 'Success' },
    { action: 'Threshold Override Acknowledged', detail: 'Conveyor 3B High-Load telemetry cleared', time: '28 minutes ago', status: 'Approved' },
    { action: 'Cold Chain Diagnostics Ran', detail: 'Zone B vault temperature calibration pass', time: '1 hour ago', status: 'Nominal' },
    { action: 'System Config Synchronized', detail: 'WebSocket broadcast cadence updated to 1000ms', time: '3 hours ago', status: 'Success' },
  ];

  return (
    <div className="page-container" style={{ maxWidth: 960 }}>
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
            Operations Profile & Session Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Current authenticated operator, security token details, and audit activity history
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ gap: '0.45rem' }}
        >
          <LogOut size={16} /> Sign Out Session
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* User Card */}
        <div className="card" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.75rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-md)',
            flexShrink: 0
          }}>
            AD
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                {user?.name || 'Chief Logistics Officer (Admin)'}
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                Active Operator
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.2rem' }}>
              {user?.email || 'admin@nexusflow.internal'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.65rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Warehouse size={14} /> Building B - Distribution Hub
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Shield size={14} /> Facility Lead & Operations Admin
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> Role: Super Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Security & Token Details */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Key size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Active Session & JWT Token Verification</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Session State
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <CheckCircle2 size={16} /> Authenticated & Valid
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Token Expiration
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                {user?.tokenExpiry ? new Date(user.tokenExpiry).toLocaleString() : 'Valid for 24 Hours'}
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Security Algorithm
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                HMAC SHA-256 (JWT)
              </div>
            </div>
          </div>

          {/* Masked Token display */}
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.775rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            overflow: 'hidden'
          }}>
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              Bearer {token ? `${token.substring(0, 30)}••••••••••••••••••••••••••••••••${token.slice(-15)}` : 'No Token'}
            </span>
            <span style={{ flexShrink: 0, fontWeight: 600, color: 'var(--color-primary)' }}>Stored in LocalStorage</span>
          </div>
        </div>

        {/* Audit Activity Trail */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <FileText size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Operational Audit Trail</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {auditActivities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--color-bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {item.action}
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)', marginTop: '0.15rem' }}>
                    {item.detail}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.675rem' }}>
                    {item.status}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {item.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
