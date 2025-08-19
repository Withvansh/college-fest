
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredRole?: 'super_admin' | 'hr_admin';
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { admin, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    if (requiredRole && admin?.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, admin, requiredRole, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && admin?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
