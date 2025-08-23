
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const useRoleRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading or if not authenticated
    if (loading || !isAuthenticated || !user) {
      return;
    }

    // For recruiters, always redirect to HRMS
    if (user.role === 'recruiter') {
      console.log('useRoleRedirect: redirecting recruiter to HRMS');
      navigate('/recruiter/hrms');
      return;
    }

    // Get the correct redirect path based on user role for other roles
    const roleRedirects = {
      jobseeker: '/jobseeker/dashboard',
      freelancer: '/freelancer/dashboard',
      client: '/client/dashboard',
      college: '/college/dashboard',
      student: '/student/dashboard',
      admin: '/admin/dashboard',
    };

    const redirectPath = roleRedirects[user.role as keyof typeof roleRedirects] || '/jobseeker/dashboard';
    console.log('useRoleRedirect: redirecting user to:', redirectPath, 'for role:', user.role);
    
    navigate(redirectPath);
  }, [user, isAuthenticated, loading, navigate]);
};
