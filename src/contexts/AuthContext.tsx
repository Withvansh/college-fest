import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { recruiterDashboardsService } from '@/lib/api/recruiterDashboards';


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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  login: (email: string, password: string, userType?: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, userType?: string) => Promise<boolean>;
  signInWithGoogle: (userType?: string) => Promise<boolean>;
  signInWithLinkedIn: (userType?: string) => Promise<boolean>;
  signInWithOTP: (email: string, userType?: string) => Promise<boolean>;
  verifyOTP: (email: string, otp: string, userType?: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (error) {
      console.error('Error loading profile:', error);
      return;
    }

    let dashboardId: string | undefined;

    if (profile.role === 'recruiter') {
      try {
        const existingDashboard = await recruiterDashboardsService.getRecruiterDashboard(authUser.id);

        if (!existingDashboard) {
          console.log('📦 No dashboard found. Creating new recruiter dashboard...');
          const newDashboard = await recruiterDashboardsService.createRecruiterDashboard({
            user_id: authUser.id,
            dashboard_name: `${profile.full_name || 'Recruiter'}'s Workspace`,
            stats: {
              activeJobs: 0,
              applications: 0,
              testsCreated: 0,
              interviewsScheduled: 0
            },
            mockData: {
              jobPosts: [],
              applicants: [],
              testResults: []
            }
          });

          dashboardId = newDashboard.id;
        } else {
          dashboardId = existingDashboard.id;
        }
      } catch (dashboardError) {
        console.error('💥 Error handling recruiter dashboard:', dashboardError);
      }
    }

    setUser({
      id: authUser.id,
      email: authUser.email || '',
      name: profile.full_name || authUser.email || '',
      role: profile.role as UserRole,
      profile_complete: profile.profile_complete,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      skills: profile.skills,
      experience_years: profile.experience_years,
      education: profile.education,
      portfolio_url: profile.portfolio_url,
      linkedin_url: profile.linkedin_url,
      github_url: profile.github_url,
      company_name: profile.company_name,
      company_size: profile.company_size,
      college_name: profile.college_name,
      student_id: profile.student_id,
      institution_name: profile.institution_name,
      avatar: profile.avatar_url,
      degree: profile.degree,
      placement_officer_contact: profile.placement_officer_contact,
      final_year_students: profile.final_year_students,
      hiring_needs: profile.hiring_needs,
      contact_info: profile.contact_info,
      website: profile.website,
      project_description: profile.project_description,
      budget_range: profile.budget_range,
      dashboardId: dashboardId,
    });
  } catch (error) {
    console.error('Error loading user profile:', error);
  }
};

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const updateProfile = async (data: any) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', user.id);

    if (error) throw error;

    // Reload user profile after update
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser);
    }
  };

  // Additional methods for compatibility
  const login = async (email: string, password: string, userType?: string): Promise<boolean> => {
    try {
      await signIn(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, userType?: string): Promise<boolean> => {
    try {
      await signUp(email, password, { full_name: name, role: userType });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const signInWithGoogle = async (userType?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return false;
    }
  };

  const signInWithLinkedIn = async (userType?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('LinkedIn sign-in error:', error);
      return false;
    }
  };

  const signInWithOTP = async (email: string, userType?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('OTP sign-in error:', error);
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string, userType?: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'magiclink'
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      return false;
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      });
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const logout = async () => {
    await signOut();
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    updateProfile,
    login,
    signup,
    signInWithGoogle,
    signInWithLinkedIn,
    signInWithOTP,
    verifyOTP,
    forgotPassword,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
