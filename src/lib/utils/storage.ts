import type {AuthUser}  from '@/contexts/AuthContext';
const AUTH_KEY = 'auth_session';
const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'user_role';
const ID_KEY = 'user_id';

export const saveSession = (user: AuthUser) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, user.token);
  localStorage.setItem(ROLE_KEY, user.role);
  localStorage.setItem(ID_KEY, user._id);
};

export const loadSession = () => {
  const savedUser = localStorage.getItem(AUTH_KEY);
  const savedToken = localStorage.getItem(TOKEN_KEY);
  if (savedUser && savedToken) {
    return { ...JSON.parse(savedUser), token: savedToken };
  }
  return null;
};

export const clearSession = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(ID_KEY);
};
