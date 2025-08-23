import { saveSession, loadSession, clearSession, getToken, getUserRole, getUserId, getUser, isAuthenticated, updateUserData } from '@/lib/utils/storage';

export interface User {
  _id: string;
  email: string;
  full_name: string;
  name?: string; // Alias for full_name for backward compatibility
  role: UserRole;
  profile_complete?: boolean;
  dashboardId?: string;
  token?: string;
  phone?: string;
  bio?: string;
  
  // Profile fields for different user types
  location?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  avatar?: string;
  
  // Recruiter/Company fields
  company_name?: string;
  company_size?: string;
  hiring_needs?: string;
  
  // College fields
  college_name?: string;
  institution_name?: string;
  placement_officer_contact?: string;
  final_year_students?: number;
  
  // Student fields
  student_id?: string;
  degree?: string;
  
  // Client/Freelancer fields
  project_description?: string;
  budget_range?: string;
  website?: string;
  contact_info?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export type UserRole = 
  | 'jobseeker' 
  | 'recruiter' 
  | 'freelancer' 
  | 'client' 
  | 'college' 
  | 'student' 
  | 'admin' 
  | 'hr_admin' 
  | 'super_admin';

// Demo credentials for testing
const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  jobseeker: { email: 'demo.candidate@minutehire.com', password: '#Candidate123' },
  recruiter: { email: 'demo.hr@minutehire.com', password: '#HRaccess123' },
  freelancer: { email: 'demo.freelancer@minutehire.com', password: '#Freelance123' },
  client: { email: 'demo.client@minutehire.com', password: '#Client123' },
  student: { email: 'demo.student@minutehire.com', password: '#Student123' },
  college: { email: 'demo.college@minutehire.com', password: '#College123' },
  admin: { email: 'admin@minutehire.com', password: 'admin123' },
  hr_admin: { email: 'hradmin@minutehire.com', password: 'hr123' },
  super_admin: { email: 'superadmin@minutehire.com', password: 'super123' },
};

// Role-based dashboard routes
export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  jobseeker: '/jobseeker/dashboard',
  recruiter: '/recruiter/hrms', // Changed to HRMS as default
  freelancer: '/freelancer/dashboard',
  client: '/client/dashboard',
  college: '/college/dashboard',
  student: '/student/dashboard',
  admin: '/admin/dashboard',
  hr_admin: '/admin/dashboard',
  super_admin: '/super-admin/dashboard',
};

class UnifiedAuthService {
  private readonly STORAGE_KEYS = {
    USER: 'auth_user',
    TOKEN: 'auth_token',
    SESSION: 'auth_session',
  };

  // API Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting API login for:', email);
      
      const response = await fetch("http://localhost:3000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const user: User = {
        _id: data.user._id,
        email: data.user.email,
        full_name: data.user.full_name,
        role: data.user.role as UserRole,
        profile_complete: data.user.profile_complete || false,
        dashboardId: data.user.dashboardId,
        token: data.token,
      };

      this.saveSession(user);
      console.log('✅ API login successful for role:', user.role);
      return { success: true, user };
    } catch (error) {
      console.error('❌ API login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }

  async signup(email: string, password: string, full_name: string, role: UserRole): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting API signup for role:', role);
      
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();
      const user: User = {
        _id: data.user.id || Date.now().toString(),
        email,
        full_name,
        role,
        profile_complete: false,
        token: data.token || `mock-token-${Date.now()}`,
      };

      this.saveSession(user);
      console.log('✅ API signup successful for role:', role);
      return { success: true, user };
    } catch (error) {
      console.error('❌ API signup failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Signup failed' 
      };
    }
  }

  // Demo Authentication (for testing)
  async demoLogin(role: UserRole): Promise<AuthResponse> {
    try {
      console.log('🎭 Demo login for role:', role);
      
      const credentials = DEMO_CREDENTIALS[role];
      if (!credentials) {
        throw new Error(`Demo credentials not found for role: ${role}`);
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const user: User = {
        _id: `demo-${role}-${Date.now()}`,
        email: credentials.email,
        full_name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        role,
        profile_complete: true,
        token: `demo-token-${role}-${Date.now()}`,
      };

      // For recruiter demo, add dashboard ID
      if (role === 'recruiter') {
        user.dashboardId = 'demo-dashboard-123';
      }

      this.saveSession(user);
      console.log('✅ Demo login successful for role:', role);
      return { success: true, user };
    } catch (error) {
      console.error('❌ Demo login failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Demo login failed' 
      };
    }
  }

  // Session Management
  saveSession(user: User): void {
    saveSession(user);
  }

  loadSession(): User | null {
    return loadSession();
  }

  clearSession(): void {
    clearSession();
  }

  // Storage utility methods
  getToken(): string | null {
    return getToken();
  }

  getUserRole(): string | null {
    return getUserRole();
  }

  getUserId(): string | null {
    return getUserId();
  }

  getCurrentUser(): User | null {
    return getUser();
  }

  isUserAuthenticated(): boolean {
    return isAuthenticated();
  }

  updateUserData(updates: Partial<User>): void {
    updateUserData(updates);
  }

  // Utility Methods
  getDashboardRoute(role: UserRole): string {
    return DASHBOARD_ROUTES[role] || '/';
  }

  getDemoCredentials(role: UserRole) {
    return DEMO_CREDENTIALS[role] || { email: '', password: '' };
  }

  getAllRoles(): UserRole[] {
    return Object.keys(DASHBOARD_ROUTES) as UserRole[];
  }

  isValidRole(role: string): role is UserRole {
    return this.getAllRoles().includes(role as UserRole);
  }
}

export const unifiedAuthService = new UnifiedAuthService();
