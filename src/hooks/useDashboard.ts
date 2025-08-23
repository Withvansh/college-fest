
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { dashboardsApi } from '@/lib/api/dashboards';

type Dashboard = {
  id?: string;
  stats: {
    totalJobs: number;
    applications: number;
    interviews: number;
  };
  onboarding_completed?: boolean;
};

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading dashboard for user:', user._id);
      
      let dashboardData = await dashboardsApi.getDashboard(user._id);
      
      // If dashboard doesn't exist, create one
      if (!dashboardData) {
        console.log('Creating dashboard for user:', user._id, 'role:', user.role);
        dashboardData = await dashboardsApi.updateDashboard(user._id, {
          stats: {
            totalJobs: 0,
            applications: 0,
            interviews: 0
          }
        });
        
        if (!dashboardData) {
          throw new Error('Failed to create dashboard');
        }
      }
      
      console.log('Dashboard loaded successfully:', dashboardData);
      setDashboard(dashboardData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboard();
    } else {
      setLoading(false);
      setDashboard(null);
    }
  }, [user, loadDashboard]);

  const updateDashboard = async (updates: Partial<Dashboard>) => {
    if (!user) return;

    try {
      console.log('Updating dashboard with:', updates);
      const updatedDashboard = await dashboardsApi.updateDashboard(user._id, updates);
      if (updatedDashboard) {
        setDashboard(updatedDashboard);
        console.log('Dashboard updated successfully');
      }
    } catch (err) {
      console.error('Error updating dashboard:', err);
      setError('Failed to update dashboard');
    }
  };

  const completeOnboarding = async () => {
    await updateDashboard({ onboarding_completed: true });
  };

  return {
    dashboard,
    loading,
    error,
    updateDashboard,
    completeOnboarding,
    refetch: loadDashboard
  };
};
