import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  LineChart,
  Bell,
  Settings,
  User,
  LogOut,
  Sun,
  Moon,
  Warehouse,
  Menu,
  X,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';

interface NavigationProps {
  wsConnected?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ wsConnected = true }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been securely logged out of NexusFlow.',
    });
    navigate('/login');
  };

  const navLinks = [
    { name: 'Live Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics & Trends', path: '/analytics', icon: LineChart },
    { name: 'Warehouse Alerts', path: '/alerts', icon: Bell },
    { name: 'System Settings', path: '/settings', icon: Settings },
    { name: 'Operations Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="mobile-header" style={{
        display: 'none',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--color-bg-secondary)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Warehouse size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
            RealTime<span style={{ color: 'var(--color-primary)' }}>Dashboard</span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-icon"
            aria-label="Toggle Theme"
            style={{ padding: '0.45rem' }}
          >
            {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-secondary btn-icon"
            aria-label="Toggle Menu"
            style={{ padding: '0.45rem' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Desktop Sidebar Navigation */}
      <aside className={`sidebar-nav ${mobileOpen ? 'open' : ''}`} style={{
        width: 260,
        flexShrink: 0,
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh',
        zIndex: 50,
      }}>
        <div>
          {/* Brand Header */}
          <div style={{
            padding: '1.5rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            borderBottom: '1px solid var(--color-border)'
          }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #60a5fa 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-md)',
            }}>
              <Warehouse size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                RealTime<span style={{ color: 'var(--color-primary)' }}>Dashboard</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Multi-Modal Telemetry
              </div>
            </div>
          </div>

          {/* Real-Time Connection Indicator Pill */}
          <div style={{ padding: '0.85rem 1.25rem 0.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.75rem',
              backgroundColor: 'var(--color-bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              fontSize: '0.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  backgroundColor: wsConnected ? 'var(--color-success)' : 'var(--color-warning)',
                  boxShadow: wsConnected ? '0 0 6px var(--color-success)' : 'none',
                }} />
                <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  {wsConnected ? 'Telemetry Active' : 'Connecting Stream'}
                </span>
              </div>
              <Radio size={14} color={wsConnected ? 'var(--color-success)' : 'var(--color-warning)'} />
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.65rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  <Icon size={19} />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Theme Toggle & User Info */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          backgroundColor: 'var(--color-bg-secondary)',
        }}>
          {/* Quick Theme Switcher */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.45rem 0.75rem',
            backgroundColor: 'var(--color-bg-tertiary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                gap: '0.35rem',
              }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} color="#f59e0b" /> Dark
                </>
              ) : (
                <>
                  <Moon size={14} /> Light
                </>
              )}
            </button>
          </div>

          {/* User Profile Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.4rem 0.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                flexShrink: 0
              }}>
                AD
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.name || 'Administrator'}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user?.email || 'admin@nexusflow.internal'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-icon"
              title="Log Out"
              aria-label="Log Out"
              style={{ padding: '0.4rem' }}
            >
              <LogOut size={16} color="var(--color-text-muted)" />
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .nav-link:hover:not(.active) {
          background-color: var(--color-bg-hover) !important;
          color: var(--color-text-primary) !important;
        }
        @media (max-width: 900px) {
          .mobile-header {
            display: flex !important;
          }
          .sidebar-nav {
            position: fixed;
            top: 57px;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            transition: transform 0.25s ease-in-out;
            box-shadow: var(--shadow-xl);
          }
          .sidebar-nav.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};
