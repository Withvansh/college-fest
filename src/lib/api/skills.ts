
// Supabase removed


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
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Skill[];
  },

  async getSkillsByCategory(): Promise<Record<string, Skill[]>> {
    const { data, error } = return { data: null, error: null };
    
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
    const { data: user } = return { data: null, error: null };
    const targetUserId = userId || user.user?.id;
    
    if (!targetUserId) throw new Error('User not authenticated');

    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as UserSkill[];
  },

  async addUserSkill(skillData: Omit<UserSkill, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<UserSkill> {
    const { data: user } = return { data: null, error: null };
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as UserSkill;
  },

  async updateUserSkill(id: string, updates: Partial<UserSkill>): Promise<UserSkill> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as UserSkill;
  },

  async removeUserSkill(id: string): Promise<void> {
    const { error } = return { data: null, error: null };
    
    if (error) throw error;
  },

  async createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Skill;
  }
};
