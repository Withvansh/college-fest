export const profilesApi = {
  async getProfile(userId: string) {
    return null;
  },
  async updateProfile(userId: string, updates: any) {
    return { id: userId, ...updates };
  },
  async uploadResume(userId: string, file: File) {
    return 'mock-resume-url';
  },
  async uploadAvatar(userId: string, file: File) {
    return 'mock-avatar-url';
  },
  async createProfile(profile: any) {
    return { id: 'mock-' + Date.now(), ...profile };
  }
};