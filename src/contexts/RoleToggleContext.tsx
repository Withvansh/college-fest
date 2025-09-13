import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type ActiveRole = 'startup' | 'recruiter';

interface RoleToggleContextType {
  // State
  activeRole: ActiveRole;
  isRoleSwitching: boolean;

  // Actions
  switchToRole: (role: ActiveRole) => Promise<void>;
  getCurrentRoleDisplay: () => string;
  getRoleColor: () => string;
  canSwitchToRole: (role: ActiveRole) => boolean;
}

const RoleToggleContext = createContext<RoleToggleContextType | null>(null);

interface RoleToggleProviderProps {
  children: ReactNode;
}

export const RoleToggleProvider: React.FC<RoleToggleProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<ActiveRole>('startup');
  const [isRoleSwitching, setIsRoleSwitching] = useState(false);

  // Initialize active role based on user type and stored preference
  useEffect(() => {
    if (user?.role) {
      const storedRole = localStorage.getItem(`activeRole_${user._id}`);
      if (storedRole === 'recruiter' || storedRole === 'startup') {
        setActiveRole(storedRole);
      } else {
        // Default to startup for startup users
        setActiveRole(user.role === 'startup' ? 'startup' : 'recruiter');
      }
    }
  }, [user]);

  const switchToRole = async (role: ActiveRole) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    if (activeRole === role) {
      return; // Already in this role
    }

    if (!canSwitchToRole(role)) {
      toast.error(`Cannot switch to ${role} role`);
      return;
    }

    try {
      setIsRoleSwitching(true);

      // Store the role preference
      localStorage.setItem(`activeRole_${user._id}`, role);

      // Update active role
      setActiveRole(role);

      toast.success(`Switched to ${role} mode`);

      // Add a small delay for UI feedback
      setTimeout(() => {
        setIsRoleSwitching(false);
      }, 500);
    } catch (error) {
      console.error('Error switching role:', error);
      toast.error('Failed to switch role');
      setIsRoleSwitching(false);
    }
  };

  const getCurrentRoleDisplay = (): string => {
    switch (activeRole) {
      case 'startup':
        return 'Startup';
      case 'recruiter':
        return 'Recruiter';
      default:
        return 'Unknown';
    }
  };

  const getRoleColor = (): string => {
    switch (activeRole) {
      case 'startup':
        return 'purple';
      case 'recruiter':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const canSwitchToRole = (role: ActiveRole): boolean => {
    if (!user) return false;

    // Startup users can switch between startup and recruiter roles
    if (user.role === 'startup') {
      return role === 'startup' || role === 'recruiter';
    }

    // Recruiter users can only be in recruiter role
    if (user.role === 'recruiter') {
      return role === 'recruiter';
    }

    return false;
  };

  const value: RoleToggleContextType = {
    activeRole,
    isRoleSwitching,
    switchToRole,
    getCurrentRoleDisplay,
    getRoleColor,
    canSwitchToRole,
  };

  return <RoleToggleContext.Provider value={value}>{children}</RoleToggleContext.Provider>;
};

export const useRoleToggle = (): RoleToggleContextType => {
  const context = useContext(RoleToggleContext);
  if (!context) {
    throw new Error('useRoleToggle must be used within a RoleToggleProvider');
  }
  return context as RoleToggleContextType;
};
