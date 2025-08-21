
// Supabase removed


export interface Project {
  id: string;
  company_id?: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'cancelled' | 'on_hold';
  priority: 'low' | 'medium' | 'high';
  start_date: string;
  end_date?: string;
  budget: number;
  actual_cost: number;
  team_lead?: string;
  client?: string;
  department?: string;
  progress_percentage: number;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  assignee?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  estimated_hours: number;
  actual_hours: number;
  created_at?: string;
  updated_at?: string;
}

export const projectsApi = {
  // Projects CRUD
  async getProjects(): Promise<Project[]> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Project[];
  },

  async getProject(id: string): Promise<Project> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Project;
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const { data: user } = return { data: null, error: null };
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Project;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Project;
  },

  async deleteProject(id: string): Promise<void> {
    const { error } = return { data: null, error: null };
    
    if (error) throw error;
  },

  // Tasks CRUD
  async getTasks(projectId?: string): Promise<Task[]> {
    // Mock query
      .from('tasks')
      .select(`
        *,
        assignee_profile:profiles!tasks_assignee_fkey(full_name, email, avatar_url),
        project:projects(name)
      `)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Task[];
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Task;
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const { data, error } = return { data: null, error: null };
    
    if (error) throw error;
    return data as Task;
  },

  async deleteTask(id: string): Promise<void> {
    const { error } = return { data: null, error: null };
    
    if (error) throw error;
  }
};
