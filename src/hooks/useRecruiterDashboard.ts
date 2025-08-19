
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recruiterDashboardsService, RecruiterDashboard } from '@/lib/api/recruiterDashboards';

export const useRecruiterDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎣 useRecruiterDashboard - Effect triggered');
    console.log('👤 User state:', { 
      exists: !!user, 
      id: user?.id, 
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
  }, [user]);

  const loadRecruiterDashboard = async () => {
    if (!user) {
      console.log('❌ loadRecruiterDashboard: No user provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Loading recruiter dashboard for user:', user.id);
      
      let dashboardData = await recruiterDashboardsService.getRecruiterDashboard(user.id);
      console.log('📊 Dashboard fetch result:', dashboardData);
      
      // If dashboard doesn't exist, create one
      if (!dashboardData) {
        console.log('🔨 Creating new recruiter dashboard for user:', user.id, 'name:', user.name || user.email);
        dashboardData = await recruiterDashboardsService.createRecruiterDashboard(
          user.id,
          user.name || user.email || 'Recruiter'
        );
        
        if (!dashboardData) {
          throw new Error('Failed to create recruiter dashboard');
        }
        console.log('✅ New dashboard created:', dashboardData);
      }
      
      console.log('✅ Dashboard loaded successfully:', dashboardData);
      setDashboard(dashboardData);
    } catch (err) {
      console.error('💥 Error loading recruiter dashboard:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recruiter dashboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    error,
    refetch: loadRecruiterDashboard
  };
};
