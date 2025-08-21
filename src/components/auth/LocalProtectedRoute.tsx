
import { useLocalAuth } from '@/contexts/LocalAuthContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface LocalProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string[];
}

const LocalProtectedRoute = ({ children, requiredRole }: LocalProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useLocalAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/jobseeker/dashboard" replace />;
  }

  if (requiredRole && !requiredRole.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default LocalProtectedRoute;
