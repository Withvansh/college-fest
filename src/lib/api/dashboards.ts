
import { supabase } from '@/integrations/supabase/client';

export interface Dashboard {
  id: string;
  user_id: string;
  role: string;
  name: string;
  welcome_message: string;
  onboarding_completed: boolean;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export const dashboardsService = {
  async getUserDashboard(userId: string): Promise<Dashboard | null> {
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching dashboard:', error);
      return null;
    }

    return data;
  },

  async createDashboard(userId: string, role: string, name: string): Promise<Dashboard | null> {
    const { data, error } = await supabase
      .from('dashboards')
      .insert({
        user_id: userId,
        role,
        name,
        welcome_message: `Welcome to your ${role} dashboard!`,
        onboarding_completed: false,
        preferences: {}
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating dashboard:', error);
      return null;
    }

    return data;
  },

  async updateDashboard(userId: string, updates: Partial<Dashboard>): Promise<Dashboard | null> {
    const { data, error } = await supabase
      .from('dashboards')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating dashboard:', error);
      return null;
    }

    return data;
  },

  getRoleBasedRedirect(role: string): string {
    switch (role) {
      case 'jobseeker':
        return '/jobseeker/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'freelancer':
        return '/freelancer/dashboard';
      case 'client':
        return '/client/dashboard';
      case 'college':
        return '/college/dashboard';
      case 'student':
        return '/student/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  }
};
