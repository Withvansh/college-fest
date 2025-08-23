import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/services/unifiedAuth';

interface UnifiedProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
  fallbackPath?: string;
}

const UnifiedProtectedRoute: React.FC<UnifiedProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
  fallbackPath = '/auth/login',
}) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to user's appropriate dashboard instead of blocking
    const userDashboard = `/auth/${user.role}`;
    return <Navigate to={userDashboard} replace />;
  }

  return <>{children}</>;
};

export default UnifiedProtectedRoute;
