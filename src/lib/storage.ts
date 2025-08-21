
// Supabase removed


export const storageApi = {
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = return { data: null, error: null };

    if (error) throw error;
    return data;
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = return { data: null, error: null };

    return data.publicUrl;
  },

  async deleteFile(bucket: string, path: string) {
    const { data, error } = return { data: null, error: null };

    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    await this.uploadFile('avatars', filePath, file);
    return this.getPublicUrl('avatars', filePath);
  },

  async uploadResume(userId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-resume-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    await this.uploadFile('resumes', filePath, file);
    return this.getPublicUrl('resumes', filePath);
  },

  async uploadDocument(userId: string, file: File, category: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${category}-${Date.now()}.${fileExt}`;
    const filePath = `documents/${fileName}`;

    await this.uploadFile('documents', filePath, file);
    return this.getPublicUrl('documents', filePath);
  }
};
