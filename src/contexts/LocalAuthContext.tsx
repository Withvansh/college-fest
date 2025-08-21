
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { localAuthService } from '@/services/localAuthService';

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  redirect: string;
};
import { toast } from 'sonner';

interface LocalAuthContextType {
  user: DemoUser | null;
  login: (email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const LocalAuthContext = createContext<LocalAuthContextType | undefined>(undefined);

export const LocalAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session on app load
    const currentUser = localAuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    try {
      const result = await localAuthService.login(email.trim(), password.trim());
      
      if (result.success && result.user) {
        // Check if role matches (if specified)
        if (role && result.user.role !== role) {
          toast.error(`This account is registered as a ${result.user.role}, not ${role}. Please use the correct login page.`);
          return false;
        }
        
        setUser(result.user);
        toast.success(`Welcome back, ${result.user.name}!`);
        
        // Navigate to user's dashboard
        navigate(result.user.redirect);
        return true;
      } else {
        toast.error(result.error || 'Login failed');
        return false;
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const logout = () => {
    localAuthService.logout();
    setUser(null);
    toast.success('Successfully logged out');
    navigate('/');
  };

  return (
    <LocalAuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </LocalAuthContext.Provider>
  );
};

export const useLocalAuth = () => {
  const context = useContext(LocalAuthContext);
  if (!context) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider');
  }
  return context;
};
