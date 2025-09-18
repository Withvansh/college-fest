import axiosInstance from '@/lib/utils/axios';
import {
  saveSession,
  loadSession,
  clearSession,
  getToken,
  getUserRole,
  getUserId,
  getUser,
  isAuthenticated,
  updateUserData,
} from '@/lib/utils/storage';
import { otpVerificationService } from './otpVerification';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
}

export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

export interface SignupResponse {
  user: User;
  token: string;
  message: string;
}

export interface User {
  _id: string;
  avatar_url?: string;
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
  requiresEmailVerification?: boolean;
  email?: string;
}

export type UserRole =
  | 'jobseeker'
  | 'recruiter'
  | 'freelancer'
  | 'client'
  | 'college'
  | 'student'
  | 'startup'
  | 'admin'
  | 'hr_admin'
  | 'super_admin';

type AxiosLikeError = {
  response?: {
    status?: number;
    data?: {
      message?: string;
      requiresEmailVerification?: boolean;
      email?: string;
    };
  };
  message?: string;
};

// Demo credentials for testing
const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string }> = {
  jobseeker: { email: 'demo.candidate@minutehire.com', password: '#Candidate123' },
  recruiter: { email: 'demo.hr@minutehire.com', password: '#HRaccess123' },
  freelancer: { email: 'demo.freelancer@minutehire.com', password: '#Freelance123' },
  client: { email: 'demo.client@minutehire.com', password: '#Client123' },
  student: { email: 'demo.student@minutehire.com', password: '#Student123' },
  college: { email: 'demo.college@minutehire.com', password: '#College123' },
  startup: { email: 'demo.startup@minutehire.com', password: '#Startup123' },
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
  startup: '/startup/dashboard',
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
      const response = await axiosInstance.post<LoginResponse>('/user/login', {
        email,
        password,
      });

      const user: User = {
        _id: response.data.user._id,
        email: response.data.user.email,
        full_name: response.data.user.full_name,
        role: response.data.user.role as UserRole,
        profile_complete: response.data.user.profile_complete || false,
        dashboardId: response.data.user.dashboardId,
        token: response.data.token,
      };

      this.saveSession(user);

      return { success: true, user };
    } catch (error: unknown) {
      const err = error as AxiosLikeError;

      // Check if email verification is required
      if (err.response?.status === 403 && err.response?.data?.requiresEmailVerification) {
        return {
          success: false,
          error: err.response.data.message,
          requiresEmailVerification: true,
          email: err.response.data.email || email,
        };
      }

      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Login failed',
      };
    }
  }

  async signup(
    email: string,
    password: string,
    full_name: string,
    role: UserRole
  ): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<SignupResponse>('/user/register', {
        email,
        password,
        full_name,
        role,
      });

      // Automatically send email verification OTP
      const emailVerificationResponse = await this.sendEmailVerification(email);

      if (emailVerificationResponse.success) {
        return {
          success: true,
          requiresEmailVerification: true,
          email: email,
        };
      } else {
        // Signup was successful but email verification failed
        return {
          success: true,
          requiresEmailVerification: true,
          email: email,
          error: 'Account created but failed to send verification email. You can resend it later.',
        };
      }
    } catch (error: unknown) {
      const err = error as AxiosLikeError;

      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Signup failed',
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
    } catch (error: unknown) {
      const err = error as AxiosLikeError;

      return {
        success: false,
        error: err instanceof Error ? err.message : 'Demo login failed',
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

  // Email Verification Methods
  async sendEmailVerification(email: string): Promise<AuthResponse> {
    try {
      console.log('📧 Sending email verification to:', email);
      const response = await otpVerificationService.sendEmailVerificationOTP(email);

      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error: unknown) {
      const err = error as AxiosLikeError;

      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to send verification email',
      };
    }
  }

  async verifyEmail(email: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await otpVerificationService.verifyEmailOTP(email, otp);

      if (response.success) {
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error: unknown) {
      const err = error as AxiosLikeError;

      return {
        success: false,
        error: err instanceof Error ? err.message : 'Email verification failed',
      };
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
