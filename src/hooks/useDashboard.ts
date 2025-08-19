
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardsService, Dashboard } from '@/lib/api/dashboards';

export const useDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboard();
    } else {
      setLoading(false);
      setDashboard(null);
    }
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading dashboard for user:', user.id);
      
      let dashboardData = await dashboardsService.getUserDashboard(user.id);
      
      // If dashboard doesn't exist, create one
      if (!dashboardData) {
        console.log('Creating dashboard for user:', user.id, 'role:', user.role);
        dashboardData = await dashboardsService.createDashboard(
          user.id,
          user.role,
          user.name
        );
        
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
  };

  const updateDashboard = async (updates: Partial<Dashboard>) => {
    if (!user) return;

    try {
      console.log('Updating dashboard with:', updates);
      const updatedDashboard = await dashboardsService.updateDashboard(user.id, updates);
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
