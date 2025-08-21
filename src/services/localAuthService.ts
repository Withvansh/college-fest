export const localAuthService = {
  login: (email: string, password: string) => {
    const mockUser = {
      id: 'demo-1',
      name: 'Demo User',
      email,
      role: 'jobseeker',
      redirect: '/jobseeker/dashboard'
    };
    return { success: true, user: mockUser };
  },
  logout: () => ({ success: true }),
  getCurrentUser: () => null
};