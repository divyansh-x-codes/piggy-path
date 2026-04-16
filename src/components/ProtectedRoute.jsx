import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication or specific roles (admin).
 * Handles the 'loading' state to prevent premature redirects during auth resolution.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAppContext();
  const location = useLocation();

  // 1. Wait for Auth & Profile to load
  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ borderTopColor: '#6D28D9' }}></div>
          <p style={{ marginTop: 16, fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Securing session...</p>
        </div>
      </div>
    );
  }

  // 2. Not logged in -> Redirect to Auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. Admin-only route && User is not admin -> Redirect to Home
  if (adminOnly && !isAdmin) {
    console.warn("🔐 ACCESS DENIED: Admin privileges required for", location.pathname);
    return <Navigate to="/home" replace />;
  }

  // 4. Authorized -> Render content
  return children;
};

export default ProtectedRoute;
