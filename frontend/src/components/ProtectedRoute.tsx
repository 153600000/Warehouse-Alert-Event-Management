import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, validateSession } = useAuthStore();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(isAuthenticated);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const valid = await validateSession();
      if (isMounted) {
        setIsValid(valid);
        setIsValidating(false);
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [validateSession]);

  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        color: 'var(--color-text-secondary)',
        gap: '1rem'
      }}>
        <Loader2 className="animate-spin" size={36} color="var(--color-primary)" />
        <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Verifying credentials & session state...</p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
