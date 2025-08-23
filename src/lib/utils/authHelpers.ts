// Auth utility functions for role checking and logout
import { getUserRole } from '@/lib/utils/storage';
import { unifiedAuthService } from '@/services/unifiedAuth';

export const checkUserRole = (requiredRoles: string[]): boolean => {
  const userRole = getUserRole();
  return userRole ? requiredRoles.includes(userRole) : false;
};

export const checkUserRoleExact = (requiredRole: string): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

export const hasAnyRole = (roles: string[]): boolean => {
  return checkUserRole(roles);
};

export const isAdmin = (): boolean => {
  return checkUserRole(['admin', 'hr_admin', 'super_admin']);
};

export const isRecruiter = (): boolean => {
  return checkUserRoleExact('recruiter');
};

export const isJobseeker = (): boolean => {
  return checkUserRoleExact('jobseeker');
};

export const handleLogout = () => {
  // Clear all auth data
  unifiedAuthService.clearSession();
  // Redirect to login
  window.location.href = '/auth';
};
