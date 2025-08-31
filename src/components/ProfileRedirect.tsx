import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const ProfileRedirect = () => {
  const { user } = useAuth();

  // Define dashboard routes for each user role
  const dashboardRoutes = {
    jobseeker: '/jobseeker/dashboard',
    recruiter: '/recruiter/dashboard',
    freelancer: '/freelancer/dashboard',
    client: '/client/dashboard',
    college: '/college/dashboard',
    student: '/student/dashboard',
  };

  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Get the dashboard route for the user's role
  const dashboardRoute = dashboardRoutes[user.role as keyof typeof dashboardRoutes];

  // If no dashboard route found for the role, fallback to auth page
  if (!dashboardRoute) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to the appropriate dashboard
  return <Navigate to={dashboardRoute} replace />;
};

export default ProfileRedirect;
