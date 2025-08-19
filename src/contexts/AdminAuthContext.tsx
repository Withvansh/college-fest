
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole = 'super_admin' | 'hr_admin';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  loginId: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  login: (loginId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedAdmin = localStorage.getItem('admin_session');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = async (loginId: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your backend
    const mockAdmins = [
      {
        id: '1',
        name: 'Super Admin',
        email: 'admin@minutehire.com',
        role: 'super_admin' as AdminRole,
        loginId: 'superadmin',
        password: 'admin123'
      },
      {
        id: '2',
        name: 'HR Manager',
        email: 'hr@minutehire.com',
        role: 'hr_admin' as AdminRole,
        loginId: 'hradmin',
        password: 'hr123'
      }
    ];

    const foundAdmin = mockAdmins.find(a => a.loginId === loginId && a.password === password);
    
    if (foundAdmin) {
      const { password: _, ...adminData } = foundAdmin;
      setAdmin(adminData);
      localStorage.setItem('admin_session', JSON.stringify(adminData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_session');
  };

  const value = {
    admin,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
