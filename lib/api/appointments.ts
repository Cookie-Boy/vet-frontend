// lib/api/appointments.ts
import { AppointmentResponse, AppointmentRequest } from "@/types/appointment";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export interface AppointmentFilters {
  doctorId?: string;
  ownerId?: string;
  petId?: string;
  status?: "BOOKED" | "CANCELLED" | "COMPLETED";
  fromDate?: string;
  toDate?: string;
}

export const appointmentsApi = {
  // Серверные методы
  server: {
    getAppointments: async (ownerId: string | undefined): Promise<AppointmentResponse[]> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/appointment/owner/${ownerId}`);
      return response.data;
    },
    getAvailableSlots: async (doctorId: string | null, date: string): Promise<{ startTime: string; endTime: string }[]> => {
      const client = await createServerApiClient();
      const params: any = { date };
      if (doctorId) params.doctorId = doctorId;
      const response = await client.get("/api/appointment/slots", { params });
      console.log("Got the response!");
      console.log(response.data);
      return response.data;
    },
  },

  // Клиентские методы
  client: {
    getAppointments: async (ownerId: string | undefined): Promise<AppointmentResponse[]> => {
      const response = await apiClient.get(`/api/appointment/owner/${ownerId}`);
      return response.data;
    },
    create: async (data: AppointmentRequest): Promise<AppointmentResponse> => {
      const response = await apiClient.post("/api/appointment", data);
      return response.data;
    },
    cancel: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/appointment/${id}`);
    },
    getAvailableSlots: async (doctorId: string | null, date: string): Promise<{ startTime: string; endTime: string }[]> => {
      const params: any = { date };
      if (doctorId) params.doctorId = doctorId;
      const response = await apiClient.get("/api/appointment/slots", { params });
      return response.data;
    },
  },
};