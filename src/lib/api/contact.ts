import axiosInstance from '../utils/axios';

export interface ContactFormData {
  name: string;
  number: string;
  email: string;
  designation: string;
  organization: string;
}

export const contactApi = {
  submitContactForm: async (data: ContactFormData) => {
    const response = await axiosInstance.post('/contact/submit', data);
    return response.data;
  },
};
