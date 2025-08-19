
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

interface SuperAdmin {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: string;
  last_login?: string;
}

interface SuperAdminAuthContextType {
  admin: SuperAdmin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const SuperAdminAuthContext = createContext<SuperAdminAuthContextType | undefined>(undefined);

export const useSuperAdminAuth = () => {
  const context = useContext(SuperAdminAuthContext);
  if (context === undefined) {
    throw new Error('useSuperAdminAuth must be used within a SuperAdminAuthProvider');
  }
  return context;
};

export const SuperAdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('super_admin_session');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Fetch admin user from database
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (error || !adminUser) {
        console.error('Admin not found:', error);
        return false;
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, adminUser.password_hash);
      if (!isValidPassword) {
        return false;
      }

      // Update last login
      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminUser.id);

      // Log admin login activity using admin_activity table
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: adminUser.id,
          action: 'login',
          details: { username }
        });

      const adminData = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        full_name: adminUser.full_name,
        role: adminUser.role
      };

      setAdmin(adminData);
      localStorage.setItem('super_admin_session', JSON.stringify(adminData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (admin) {
      // Log logout activity using admin_activity table
      await supabase
        .from('admin_activity')
        .insert({
          admin_id: admin.id,
          action: 'logout'
        });
    }
    
    setAdmin(null);
    localStorage.removeItem('super_admin_session');
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
    loading,
  };

  return (
    <SuperAdminAuthContext.Provider value={value}>
      {children}
    </SuperAdminAuthContext.Provider>
  );
};
