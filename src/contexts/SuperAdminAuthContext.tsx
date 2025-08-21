
import React, { createContext, useContext, useState, useEffect } from 'react';

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
      
      // Mock authentication - replace with your API call
      const mockAdmins = [
        {
          id: '1',
          username: 'superadmin',
          email: 'admin@minutehire.com',
          full_name: 'Super Admin',
          role: 'super_admin',
          password: 'admin123'
        }
      ];

      const foundAdmin = mockAdmins.find(a => a.username === username && a.password === password);
      
      if (foundAdmin) {
        const { password: _, ...adminData } = foundAdmin;
        setAdmin(adminData);
        localStorage.setItem('super_admin_session', JSON.stringify(adminData));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
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
