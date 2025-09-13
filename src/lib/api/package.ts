import api from '../utils/axios';
import { Package } from '@/types/package';

export const packageApi = {
  getAllPackages: async () => {
    const response = await api.get('/packages');
    return response.data;
  },

  getPackagesByCategory: async (category: string) => {
    const response = await api.get(`/packages/category/${category}`);
    return response.data;
  },

  getPackageById: async (id: string) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  }
};