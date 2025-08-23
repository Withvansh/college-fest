
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { recruiterDashboardsApi } from '@/lib/api/recruiterDashboards';

type RecruiterDashboard = {
  id: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
};

type DashboardAPIResponse = {
  id?: string;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  pendingApplications: number;
};

export const useRecruiterDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecruiterDashboard = useCallback(async () => {
    if (!user) {
      console.log('❌ loadRecruiterDashboard: No user provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Loading recruiter dashboard for user:', user._id);
      
      let dashboardData = await recruiterDashboardsApi.getDashboard(user._id);
      console.log('📊 Dashboard fetch result:', dashboardData);
      
      // If dashboard doesn't exist, create one
      if (!dashboardData) {
        console.log('🔨 Creating new recruiter dashboard for user:', user._id, 'name:', user.name || user.email);
        dashboardData = await recruiterDashboardsApi.createDashboard({
          userId: user._id,
          name: user.name || user.email || 'Recruiter'
        });
        
        if (!dashboardData) {
          throw new Error('Failed to create recruiter dashboard');
        }
        console.log('✅ New dashboard created:', dashboardData);
      }
      
      // Ensure the dashboard has all required properties
      const formattedDashboard: RecruiterDashboard = {
        id: (dashboardData as DashboardAPIResponse)?.id || user._id,
        totalJobs: dashboardData.totalJobs || 0,
        activeJobs: dashboardData.activeJobs || 0,
        totalApplications: dashboardData.totalApplications || 0,
        pendingApplications: dashboardData.pendingApplications || 0,
      };
      
      console.log('✅ Dashboard loaded successfully:', formattedDashboard);
      setDashboard(formattedDashboard);
    } catch (err) {
      console.error('💥 Error loading recruiter dashboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recruiter dashboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('🎣 useRecruiterDashboard - Effect triggered');
    console.log('👤 User state:', { 
      exists: !!user, 
      id: user?._id, 
      role: user?.role,
      name: user?.name,
      email: user?.email
    });

    if (user && user.role === 'recruiter') {
      loadRecruiterDashboard();
    } else if (user && user.role !== 'recruiter') {
      console.log('❌ User is not a recruiter:', user.role);
      setLoading(false);
      setError('User is not a recruiter');
      setDashboard(null);
    } else if (!user) {
      console.log('⏳ No user yet, waiting...');
      setLoading(false);
      setDashboard(null);
    }
  }, [user, loadRecruiterDashboard]);

  return {
    dashboard,
    loading,
    error,
    refetch: loadRecruiterDashboard
  };
};
