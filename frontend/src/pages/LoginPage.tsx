import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Warehouse, Lock, User, AlertCircle, ArrowRight, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useToastStore } from '../store/toastStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoading, clearError } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { addToast } = useToastStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login(username, password);
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: 'Welcome back to NexusFlow Operations Console.',
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      // Handled in store
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      backgroundColor: 'var(--color-bg-primary)',
      position: 'relative',
    }}>
      {/* Top right theme toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-icon"
          aria-label="Toggle theme"
          style={{ boxShadow: 'var(--shadow-sm)' }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} />}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          width: '100%',
          maxWidth: 440,
          backgroundColor: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-xl)',
          padding: '2.25rem 2rem',
        }}
      >
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #60a5fa 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '1rem',
          }}>
            <Warehouse size={28} />
          </div>

          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Multi-Modal <span style={{ color: 'var(--color-primary)' }}>Dashboard</span>
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
            Smart Warehouse Sensor Monitoring (Full-Stack Assessment)
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--color-error-bg)',
              border: '1px solid var(--color-error-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.4rem',
            }}>
              Operator Username
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)' }}>
                <User size={17} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="e.g. admin"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: '0.4rem',
            }}>
              Security Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '0.85rem', color: 'var(--color-text-muted)' }}>
                <Lock size={17} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{ width: '100%', paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              fontSize: '0.95rem',
              width: '100%',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {isLoading ? (
              'Authenticating...'
            ) : (
              <>
                Access Mission Control <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div style={{
          marginTop: '1.5rem',
          padding: '0.85rem',
          backgroundColor: 'var(--color-bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <ShieldCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.775rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Demo Credentials:</span>
            <br />
            Username: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>admin</code> &nbsp;|&nbsp;
            Password: <code style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>password</code>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
