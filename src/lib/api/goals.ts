
import { supabase } from "@/integrations/supabase/client";

export interface Goal {
  id: string;
  employee_id: string;
  title: string;
  description?: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  created_at?: string;
  updated_at?: string;
}

export const goalsApi = {
  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        employee:profiles!goals_employee_id_fkey(full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Goal[];
  },

  async getGoal(id: string): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        employee:profiles!goals_employee_id_fkey(full_name, email, avatar_url)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Goal;
  },

  async createGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('goals')
      .insert([{
        ...goal,
        employee_id: user.user.id
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data as Goal;
  },

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Goal;
  },

  async deleteGoal(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async updateProgress(id: string, currentValue: number): Promise<Goal> {
    const { data, error } = await supabase
      .from('goals')
      .update({ current_value: currentValue })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as Goal;
  }
};
