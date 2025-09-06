import axiosInstance from '../utils/axios';

export interface User {
  
  id: string;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  verify: boolean;
  availableForRole?: string;
  package_purchased?: string[];
}

export interface CreateUserData {
  email: string;
  full_name: string;
  role: string;
  password: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  availableForRole?: string;
}

export interface UpdateUserData {
  full_name?: string;
  role?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  avatar_url?: string;
  availableForRole?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserResponse {
  success: boolean;
  user?: User;
  users?: User[];
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

export const userAPI = {
  // Get all users with pagination and filters
  async getAllUsers(page = 1, limit = 20, filters: Record<string, any> = {}): Promise<UserListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      console.log('Fetching users with params:', queryParams.toString());
      
      const response = await axiosInstance.get(`/user?${queryParams}`);
      const result = response.data;
      
      console.log('Fetched users:', result);
      
      // Transform _id to id and handle different possible response formats
      const transformUser = (user: any): User => ({
        id: user._id || user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        skills: user.skills || [],
        avatar_url: user.avatar_url,
        created_at: user.created_at,
        updated_at: user.updated_at,
        verify: user.verify,
        availableForRole: user.availableForRole,
        package_purchased: user.package_purchased || [],
      });
      
      if (result.data && Array.isArray(result.data)) {
        // Backend returns { data: User[], total: number, page: number, limit: number }
        return {
          users: result.data.map(transformUser),
          total: result.total || result.data.length,
          page: result.page || page,
          totalPages: Math.ceil((result.total || result.data.length) / limit),
        };
      } else if (result.users) {
        return {
          users: result.users.map(transformUser),
          total: result.total || result.users.length,
          page: result.page || page,
          totalPages: result.totalPages || Math.ceil((result.total || result.users.length) / limit),
        };
      } else if (Array.isArray(result)) {
        return {
          users: result.map(transformUser),
          total: result.length,
          page: 1,
          totalPages: 1,
        };
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await axiosInstance.get(`/user/${id}`);
      return response.data.user || response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  async createUser(userData: CreateUserData): Promise<User> {
    try {
      console.log('Creating user:', userData);
      
      const response = await axiosInstance.post('/user/register', userData);
      
      console.log('Created user:', response.data);
      return response.data.user || response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to create user');
    }
  },

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      console.log('Updating user:', id, userData);
      
      const response = await axiosInstance.put(`/user/${id}`, userData);
      
      console.log('Updated user:', response.data);
      return response.data.user || response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to update user');
    }
  },

  // Delete user
  async deleteUser(id: string): Promise<void> {
    try {
      console.log('Deleting user:', id);
      
      await axiosInstance.delete(`/user/${id}`);
      
      console.log('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  },

  // Get user statistics
  async getUserStats(): Promise<{
    total: number;
    jobseekers: number;
    recruiters: number;
    freelancers: number;
    clients: number;
    colleges: number;
    students: number;
    admins: number;
  }> {
    try {
      // This could be a separate endpoint, but for now we'll calculate from all users
      const { users } = await this.getAllUsers(1, 1000); // Get all users to calculate stats
      
      const stats = {
        total: users.length,
        jobseekers: users.filter(u => u.role === 'jobseeker').length,
        recruiters: users.filter(u => u.role === 'recruiter').length,
        freelancers: users.filter(u => u.role === 'freelancer').length,
        clients: users.filter(u => u.role === 'client').length,
        colleges: users.filter(u => u.role === 'college').length,
        students: users.filter(u => u.role === 'student').length,
        admins: users.filter(u => u.role.includes('admin')).length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },
};
