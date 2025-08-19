
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdminAuth } from '@/contexts/SuperAdminAuthContext';

interface SuperAdminProtectedRouteProps {
  children: React.ReactNode;
}

const SuperAdminProtectedRoute: React.FC<SuperAdminProtectedRouteProps> = ({ children }) => {
  const { admin, isAuthenticated, loading } = useSuperAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/super-admin-login');
      return;
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default SuperAdminProtectedRoute;
