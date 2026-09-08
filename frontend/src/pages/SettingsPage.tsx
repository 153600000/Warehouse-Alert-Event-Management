import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Sun,
  Moon,
  Radio,
  Sliders,
  Bell,
  RotateCcw,
  Check,
  Shield,
  Zap,
  Thermometer,
  Snowflake,
  Battery
} from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useSettingsStore } from '../store/settingsStore';
import { useToastStore } from '../store/toastStore';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useThemeStore();
  const {
    streamingIntervalMs,
    pollingIntervalMs,
    thresholds,
    audioNotifications,
    autoRefreshAnalytics,
    setStreamingInterval,
    setPollingInterval,
    setThresholds,
    toggleAudio,
    toggleAutoRefresh,
    resetDefaults,
  } = useSettingsStore();

  const { addToast } = useToastStore();

  const handleReset = () => {
    resetDefaults();
    addToast({
      type: 'info',
      title: 'Preferences Restored',
      message: 'Factory system thresholds and intervals have been reset.',
    });
  };

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
            System Settings & Operations Preferences
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
            Configure WebSocket cadence, visual theme, and automated alert telemetry boundaries
          </p>
        </div>

        <button
          onClick={handleReset}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.4rem' }}
        >
          <RotateCcw size={15} /> Reset Defaults
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Section 1: Appearance & Theming */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Sun size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interface Theme Mode</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}>
            {/* Dark mode card */}
            <div
              onClick={() => {
                setTheme('dark');
                addToast({ type: 'info', title: 'Theme Updated', message: 'Dark mode active.' });
              }}
              style={{
                border: `2px solid ${theme === 'dark' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  backgroundColor: '#111827',
                  border: '1px solid #374151',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f3f4f6'
                }}>
                  <Moon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Dark Theme</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                    High-contrast operations mode
                  </div>
                </div>
              </div>
              {theme === 'dark' && <Check size={18} color="var(--color-primary)" />}
            </div>

            {/* Light mode card */}
            <div
              onClick={() => {
                setTheme('light');
                addToast({ type: 'info', title: 'Theme Updated', message: 'Light mode active.' });
              }}
              style={{
                border: `2px solid ${theme === 'light' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                backgroundColor: 'var(--color-bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a'
                }}>
                  <Sun size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Light Theme</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                    High readability daylight palette
                  </div>
                </div>
              </div>
              {theme === 'light' && <Check size={18} color="var(--color-primary)" />}
            </div>
          </div>
        </div>

        {/* Section 2: Real-Time Stream & Ingestion Frequency */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Radio size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Telemetry Ingestion Frequencies</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Slider 1: WebSocket Broadcast Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Live WebSocket Streaming Cadence
                  </label>
                  <p style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                    Frequency of live sensor packet broadcast from server
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
                  {streamingIntervalMs} ms ({streamingIntervalMs / 1000}s)
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={3000}
                step={100}
                value={streamingIntervalMs}
                onChange={(e) => setStreamingInterval(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>

            {/* Slider 2: Periodic Polling Interval */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Periodic Analytics Polling Interval
                  </label>
                  <p style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)' }}>
                    Background sync timer for aggregated summary endpoint
                  </p>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-primary)' }}>
                  {pollingIntervalMs / 1000} seconds
                </span>
              </div>
              <input
                type="range"
                min={5000}
                max={30000}
                step={1000}
                value={pollingIntervalMs}
                onChange={(e) => setPollingInterval(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Telemetry Alert Threshold Sliders */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <Sliders size={20} color="var(--color-primary)" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Telemetry Safety Threshold Triggers</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}>
            {/* Threshold 1: Max Ambient Temp */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Thermometer size={16} color="var(--color-error)" /> Max Ambient Temp
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {thresholds.maxAmbientTemp}°C
                </span>
              </div>
              <input
                type="range"
                min={22}
                max={35}
                step={0.5}
                value={thresholds.maxAmbientTemp}
                onChange={(e) => setThresholds({ maxAmbientTemp: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-error)' }}
              />
            </div>

            {/* Threshold 2: Cold Chain Limit */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Snowflake size={16} color="#06b6d4" /> Cold Chain Limit
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {thresholds.maxColdChainTemp}°C
                </span>
              </div>
              <input
                type="range"
                min={-20}
                max={-10}
                step={0.5}
                value={thresholds.maxColdChainTemp}
                onChange={(e) => setThresholds({ maxColdChainTemp: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#06b6d4' }}
              />
            </div>

            {/* Threshold 3: Max Conveyor Payload */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Zap size={16} color="#f59e0b" /> Max Conveyor Payload
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {thresholds.maxConveyorLoad} kg
                </span>
              </div>
              <input
                type="range"
                min={450}
                max={750}
                step={10}
                value={thresholds.maxConveyorLoad}
                onChange={(e) => setThresholds({ maxConveyorLoad: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#f59e0b' }}
              />
            </div>

            {/* Threshold 4: Min AGV Battery */}
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Battery size={16} color="var(--color-success)" /> Min AGV Battery
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {thresholds.minAgvBattery}%
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={40}
                step={1}
                value={thresholds.minAgvBattery}
                onChange={(e) => setThresholds({ minAgvBattery: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--color-success)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
