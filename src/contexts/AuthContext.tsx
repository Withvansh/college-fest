import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as authLogin, signup as authSignup, AuthResponse } from '@/services/auth';
import { toast } from 'sonner';
import { saveSession, loadSession, clearSession } from '@/lib/utils/storage';
import { dashboardRoutes } from '@/config/routes';
import { handleError } from '@/lib/utils/errorHandler';

export type UserRole =
  | 'jobseeker'
  | 'recruiter'
  | 'freelancer'
  | 'client'
  | 'college'
  | 'student'
  | 'admin'
  | 'hr_admin';

 export interface AuthUser {
  _id: string;
  email: string;
  full_name: string;
  role: UserRole;
  token: string; // Authentication token for API calls
  profile_complete?: boolean;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  github_url?: string;
  company_name?: string;
  company_size?: string;
  college_name?: string;
  student_id?: string;
  institution_name?: string;
  avatar?: string;
  dashboardId?: string;
  degree?: string;
  placement_officer_contact?: string;
  final_year_students?: number;
  hiring_needs?: string;
  contact_info?: string;
  website?: string;
  project_description?: string;
  budget_range?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
  getDashboardRoute: (role: UserRole) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session) setUser(session);
    setLoading(false);
  }, []);

  const getDashboardRoute = (role: UserRole): string => dashboardRoutes[role] || '/';

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response: AuthResponse = await authLogin(email, password);
      console.log('Login response:', response);
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          role: response.user.role as UserRole,
          profile_complete: false,
        };
        setUser(userData);
        saveSession(userData);
        toast.success(`Welcome back, ${response.user.full_name}!`);
        return true;
      }
      toast.error('Login failed. Please check your credentials.');
      return false;
    } catch (error: unknown) {
      handleError(error, 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response: AuthResponse = await authSignup(email, password, name, role);
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          role: response.user.role as UserRole,
          profile_complete: false,
        };
        setUser(userData);
        saveSession(userData);
        toast.success(`Account created successfully! Welcome, ${response.user.full_name}!`);
        return true;
      }
      toast.error('Signup failed. Please try again.');
      return false;
    } catch (error: unknown) {
      handleError(error, 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    clearSession();
    toast.success('Successfully logged out');
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    saveSession(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        getDashboardRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
