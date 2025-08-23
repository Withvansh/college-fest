import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { unifiedAuthService, User, UserRole, AuthResponse } from '@/services/unifiedAuth';

interface AuthContextType {
  // State
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, full_name: string, role: UserRole) => Promise<boolean>;
  demoLogin: (role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // Utilities
  getDashboardRoute: (role?: UserRole) => string;
  getDemoCredentials: (role: UserRole) => { email: string; password: string };
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const UnifiedAuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = unifiedAuthService.loadSession();
        if (savedUser) {
          setUser(savedUser);
          console.log('🔄 Auth initialized with user:', savedUser.role);
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        unifiedAuthService.clearSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleAuthResponse = async (response: AuthResponse, action: string): Promise<boolean> => {
    if (response.success && response.user) {
      setUser(response.user);
      toast.success(`${action} successful! Welcome ${response.user.full_name}`);

      // Navigate to appropriate dashboard
      const dashboardRoute = unifiedAuthService.getDashboardRoute(response.user.role);
      console.log(`🎯 Redirecting ${response.user.role} to:`, dashboardRoute);

      // Special handling for recruiters with dashboard ID
      if (response.user.role === 'recruiter' && response.user.dashboardId) {
        navigate(`/recruiter/dashboard/${response.user.dashboardId}`);
      } else {
        navigate(dashboardRoute);
      }

      return true;
    } else {
      toast.error(response.error || `${action} failed`);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await unifiedAuthService.login(email, password);
      return await handleAuthResponse(response, 'Login');
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    full_name: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await unifiedAuthService.signup(email, password, full_name, role);
      return await handleAuthResponse(response, 'Account creation');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role: UserRole): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await unifiedAuthService.demoLogin(role);
      return await handleAuthResponse(response, 'Demo login');
    } catch (error) {
      toast.error('Demo login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    try {
      unifiedAuthService.clearSession();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/');
      console.log('👋 User logged out');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) throw new Error('No user to update');

    try {
      const updatedUser = { ...user, ...updates };
      unifiedAuthService.saveSession(updatedUser);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      console.log('📝 Profile updated for user:', user.id);
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      toast.error('Profile update failed');
      throw error;
    }
  };

  const getDashboardRoute = (role?: UserRole): string => {
    const targetRole = role || user?.role;
    return targetRole ? unifiedAuthService.getDashboardRoute(targetRole) : '/';
  };

  const getDemoCredentials = (role: UserRole) => {
    return unifiedAuthService.getDemoCredentials(role);
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    // State
    user,
    isAuthenticated: !!user,
    loading,

    // Actions
    login,
    signup,
    demoLogin,
    logout,
    updateProfile,

    // Utilities
    getDashboardRoute,
    getDemoCredentials,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
