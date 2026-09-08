import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CRITICAL FRONTEND ERROR CAUGHT]:', error, errorInfo);
  }

  public handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: 'var(--color-bg-primary)',
          color: 'var(--color-text-primary)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)',
            color: 'var(--color-error)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.25rem',
          }}>
            <ShieldAlert size={36} />
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            System Fault Intercepted
          </h1>
          <p style={{
            maxWidth: 500,
            fontSize: '0.9rem',
            color: 'var(--color-text-secondary)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            The application safely isolated an unhandled client component error. Your telemetry session remains protected.
          </p>

          <button
            onClick={this.handleReload}
            className="btn btn-primary"
            style={{ gap: '0.5rem' }}
          >
            <RefreshCw size={16} /> Reload Telemetry Console
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
