import React, { createContext, useContext, useEffect, useState } from 'react';


export type UserRole = 'jobseeker' | 'recruiter' | 'freelancer' | 'client' | 'college' | 'student' | 'admin' | 'hr_admin';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
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
  login: (email: string, password: string, userType?: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, userType?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('auth_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);



  const login = async (email: string, password: string, userType?: string): Promise<boolean> => {
    // Mock authentication - replace with your API call
    const mockUsers = [
      {
        id: '1',
        email: 'user@example.com',
        name: 'Test User',
        role: 'jobseeker' as UserRole,
        profile_complete: true
      }
    ];

    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password') {
      setUser(foundUser);
      localStorage.setItem('auth_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, userType?: string): Promise<boolean> => {
    // Mock signup - replace with your API call
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      role: (userType as UserRole) || 'jobseeker',
      profile_complete: false
    };
    
    setUser(newUser);
    localStorage.setItem('auth_session', JSON.stringify(newUser));
    return true;
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('auth_session');
  };

  const updateProfile = async (data: any) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('auth_session', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
