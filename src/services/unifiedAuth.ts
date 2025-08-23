export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  profile_complete?: boolean;
  dashboardId?: string;
  token?: string;
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
        id: data.user.id,
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
        id: data.user.id || Date.now().toString(),
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
        id: `demo-${role}-${Date.now()}`,
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
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(this.STORAGE_KEYS.TOKEN, user.token || '');
      localStorage.setItem(this.STORAGE_KEYS.SESSION, JSON.stringify({
        userId: user.id,
        role: user.role,
        timestamp: Date.now(),
      }));
      
      // Backward compatibility with existing system
      localStorage.setItem('user_role', user.role);
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('auth_session', JSON.stringify(user));
      localStorage.setItem('auth_token', user.token || '');
      
      console.log('💾 Session saved for user:', user.id, 'role:', user.role);
    } catch (error) {
      console.error('❌ Failed to save session:', error);
    }
  }

  loadSession(): User | null {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEYS.USER);
      if (!userData) return null;

      const user = JSON.parse(userData) as User;
      console.log('📖 Session loaded for user:', user.id, 'role:', user.role);
      return user;
    } catch (error) {
      console.error('❌ Failed to load session:', error);
      this.clearSession();
      return null;
    }
  }

  clearSession(): void {
    try {
      // Clear all auth-related localStorage keys
      const keysToRemove = [
        ...Object.values(this.STORAGE_KEYS),
        'user_role',
        'user_id',
        'auth_session',
        'auth_token',
        'local_auth_user',
        'admin_session',
        'super_admin_session'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('🗑️ Session cleared');
    } catch (error) {
      console.error('❌ Failed to clear session:', error);
    }
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
