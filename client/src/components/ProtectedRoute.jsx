import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-yellow flex items-center justify-center p-4">
        <div className="bg-brand-charcoal p-8 rounded-3xl text-white flex items-center gap-3 shadow-2xl">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-brand-yellow border-t-transparent" />
          <span className="text-sm font-semibold">Authenticating session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
