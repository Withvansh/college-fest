import type { User } from '@/services/unifiedAuth';

const AUTH_KEY = 'auth_session';
const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'user_role';
const ID_KEY = 'user_id';
const USER_KEY = 'auth_user';

export const saveSession = (user: User) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, user.token || '');
    localStorage.setItem(ROLE_KEY, user.role);
    localStorage.setItem(ID_KEY, user._id);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    console.log('💾 Session saved:', { id: user._id, role: user.role });
  } catch (error) {
    console.error('❌ Failed to save session:', error);
  }
};

export const loadSession = (): User | null => {
  try {
    const savedUser = localStorage.getItem(AUTH_KEY);
    const savedToken = localStorage.getItem(TOKEN_KEY);
    
    if (savedUser && savedToken) {
      const user = JSON.parse(savedUser) as User;
      // Ensure token is included
      return { ...user, token: savedToken };
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to load session:', error);
    clearSession();
    return null;
  }
};

export const clearSession = () => {
  try {
    const keysToRemove = [
      AUTH_KEY,
      TOKEN_KEY,
      ROLE_KEY,
      ID_KEY,
      USER_KEY,
      'local_auth_user',
      'admin_session',
      'super_admin_session'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('🗑️ Session cleared');
  } catch (error) {
    console.error('❌ Failed to clear session:', error);
  }
};

// Helper functions to get individual values
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUserRole = (): string | null => {
  return localStorage.getItem(ROLE_KEY);
};

export const getUserId = (): string | null => {
  return localStorage.getItem(ID_KEY);
};

export const getUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) as User : null;
  } catch (error) {
    console.error('❌ Failed to get user:', error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  const userId = getUserId();
  return !!(token && userId);
};

// Update specific user data
export const updateUserData = (updates: Partial<User>): void => {
  try {
    const currentUser = getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      saveSession(updatedUser);
      console.log('📝 User data updated:', updates);
    }
  } catch (error) {
    console.error('❌ Failed to update user data:', error);
  }
};
