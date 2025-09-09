import axios from '@/lib/utils/axios';

export interface UploadResult {
  success: boolean;
  avatar_url?: string;
  message: string;
}

/**
 * Upload profile picture for a user
 */
export const uploadProfilePicture = async (userId: string, file: File): Promise<UploadResult> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please select a valid image file');
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axios.post(`/user/${userId}/upload-avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      avatar_url: response.data.avatar_url,
      message: response.data.message || 'Profile picture uploaded successfully!',
    };
  } catch (error: any) {
    console.error('Profile picture upload error:', error);

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to upload profile picture',
    };
  }
};

/**
 * Delete profile picture for a user
 */
export const deleteProfilePicture = async (userId: string): Promise<UploadResult> => {
  try {
    const response = await axios.delete(`/user/${userId}/delete-avatar`);

    return {
      success: true,
      message: response.data.message || 'Profile picture deleted successfully!',
    };
  } catch (error: any) {
    console.error('Profile picture deletion error:', error);

    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to delete profile picture',
    };
  }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`/user/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, profileData: any) => {
  try {
    const response = await axios.put(`/user/${userId}`, profileData);
    return response.data;
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

export default {
  uploadProfilePicture,
  deleteProfilePicture,
  getUserProfile,
  updateUserProfile,
};
