import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRecruiterDashboard } from '@/hooks/useRecruiterDashboard';

const RecruiterDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { dashboard, loading: dashboardLoading, error } = useRecruiterDashboard();
  const navigate = useNavigate();

  console.log('RecruiterDashboard - Component state:', {
    user: !!user,
    userRole: user?.role,
    authLoading,
    dashboardLoading,
    dashboard: !!dashboard,
    dashboardId: dashboard?.id,
    error,
  });

  useEffect(() => {
    // If we have a dashboard, redirect to the specific dashboard URL
    if (dashboard && !dashboardLoading && !authLoading) {
      const dashboardUrl = `/recruiter/dashboard/${dashboard.id}`;

      navigate(dashboardUrl, { replace: true });
    }
  }, [dashboard, dashboardLoading, authLoading, navigate]);

  if (authLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/recruiter" replace />;
  }

  if (user.role !== 'recruiter') {
    return <Navigate to="/" replace />;
  }

  // If there's an error loading the dashboard, show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading dashboard: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // This component should redirect before showing anything, but show a loading state just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Setting up your dashboard...</p>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
