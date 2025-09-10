import axiosInstance from "../utils/axios";

export interface ICounsellorBooking {
  _id: string;
  counsellorId: string;
  studentId: string;
  bookingDate: Date;
  studentDetails: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCreateData {
  counsellorId: string;
  bookingDate: Date;
  studentDetails: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  };
   studentId:string
}

export const counsellorBookingAPI = {
  // Create a new booking
  async createBooking(data: BookingCreateData): Promise<ICounsellorBooking> {
    try {
      const response = await axiosInstance.post('/counsellor-bookings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  // Get student's bookings
  async getStudentBookings(): Promise<ICounsellorBooking[]> {
    try {
      const response = await axiosInstance.get('/counsellor-bookings/student');
      return response.data;
    } catch (error) {
      console.error('Error fetching student bookings:', error);
      throw error;
    }
  },

  // Get counsellor's bookings
  async getCounsellorBookings(counsellorId: string): Promise<ICounsellorBooking[]> {
    try {
      const response = await axiosInstance.get(`/counsellor-bookings/counsellor/${counsellorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching counsellor bookings:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: ICounsellorBooking['status']
  ): Promise<ICounsellorBooking> {
    try {
      const response = await axiosInstance.patch(`/counsellor-bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Cancel/Delete booking
  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await axiosInstance.delete(`/counsellor-bookings/${bookingId}`);
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  },

  // Check booking availability
  async checkAvailability(counsellorId: string, date: Date): Promise<boolean> {
    try {
      const response = await axiosInstance.get(`/counsellor-bookings/availability`, {
        params: {
          counsellorId,
          date: date.toISOString(),
        },
      });
      return response.data.available;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};
