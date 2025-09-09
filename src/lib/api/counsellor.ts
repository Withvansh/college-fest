// lib/api/counsellor.ts
import axiosInstance from "../utils/axios";

export interface ICounsellor {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  specialization: string;
  availableDates: Date[];
  createdAt?: Date;
  updatedAt?: Date;
  image?: string; // Optional field for frontend
}

export interface CounsellorCreateData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  experience: string;
  specialization: string;
  availableDates: Date[];
}

export interface CounsellorUpdateData {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  experience?: string;
  specialization?: string;
  availableDates?: Date[];
}

export interface AppointmentBookingData {
  counsellorId: string;
  date: Date;
  userDetails: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

export const counsellorAPI = {
  async getAllCounsellors(): Promise<ICounsellor[]> {
    try {
      const response = await axiosInstance.get('/counsellor');
      return response.data.counsellors;
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      throw error;
    }
  },

  async getCounsellorById(id: string): Promise<ICounsellor> {
    try {
      const response = await axiosInstance.get(`/counsellor/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching counsellor by ID:', error);
      throw error;
    }
  },

  async getCounsellorByEmail(email: string): Promise<ICounsellor> {
    try {
      const response = await axiosInstance.get(`/counsellor/email/${email}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching counsellor by email:', error);
      throw error;
    }
  },

  async createCounsellor(data: CounsellorCreateData): Promise<ICounsellor> {
    try {
      const response = await axiosInstance.post('/counsellor', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating counsellor:', error);
      throw error;
    }
  },

  async updateCounsellor(id: string, data: CounsellorUpdateData): Promise<ICounsellor> {
    try {
      const response = await axiosInstance.put(`/counsellor/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating counsellor:', error);
      throw error;
    }
  },

  async deleteCounsellor(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/counsellor/${id}`);
    } catch (error) {
      console.error('Error deleting counsellor:', error);
      throw error;
    }
  },

  async bookAppointment(data: AppointmentBookingData): Promise<any> {
    try {
      const response = await axiosInstance.post('/appointments/book', data);
      return response.data.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  async getAvailableSlots(counsellorId: string, date: Date): Promise<string[]> {
    try {
      const response = await axiosInstance.get(`/counsellor/${counsellorId}/slots`, {
        params: { date: date.toISOString().split('T')[0] }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }
};