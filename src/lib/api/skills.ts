
import { supabase } from "@/integrations/supabase/client";

export interface Skill {
  id: string;
  name: string;
  category?: string;
  description?: string;
  created_at?: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  proficiency_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years_of_experience: number;
  verified: boolean;
  skill?: Skill;
  created_at?: string;
  updated_at?: string;
}

export const skillsApi = {
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data as Skill[];
  },

  async getSkillsByCategory(): Promise<Record<string, Skill[]>> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category, name');
    
    if (error) throw error;
    
    // Group by category
    const groupedSkills = (data as Skill[])?.reduce((acc, skill) => {
      const category = skill.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
    
    return groupedSkills || {};
  },

  async getUserSkills(userId?: string): Promise<UserSkill[]> {
    const { data: user } = await supabase.auth.getUser();
    const targetUserId = userId || user.user?.id;
    
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_skills')
      .select(`
        *,
        skill:skills(*)
      `)
      .eq('user_id', targetUserId)
      .order('years_of_experience', { ascending: false });
    
    if (error) throw error;
    return data as UserSkill[];
  },

  async addUserSkill(skillData: Omit<UserSkill, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserSkill> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('user_skills')
      .insert([{
        ...skillData,
        user_id: user.user.id,
        verified: skillData.verified || false
      }])
      .select(`
        *,
        skill:skills(*)
      `)
      .single();
    
    if (error) throw error;
    return data as UserSkill;
  },

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    const { data, error } = await supabase
      .from('user_skills')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        skill:skills(*)
      `)
      .single();
    
    if (error) throw error;
    return data as UserSkill;
  },

  async removeUserSkill(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();
    
    if (error) throw error;
    return data as Skill;
  }
};
