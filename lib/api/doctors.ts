// lib/api/doctors.ts
import { DoctorResponse, DoctorRequest } from "@/types/doctor";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const doctorsApi = {
  // Серверные методы (для Server Components)
  server: {
    getAll: async (): Promise<DoctorResponse[]> => {
      const client = await createServerApiClient();
      const response = await client.get("/api/management/doctors");
      console.log("Got all doctors!");
      console.log(response);
      return response.data;
    },
    getById: async (id: string): Promise<DoctorResponse> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/management/doctors/${id}`);
      return response.data;
    },
  },

  // Клиентские методы (для Client Components)
  client: {
    getAll: async (): Promise<DoctorResponse[]> => {
      const response = await apiClient.get("/api/management/doctors");
      return response.data;
    },
    getById: async (id: string): Promise<DoctorResponse> => {
      const response = await apiClient.get(`/api/management/doctors/${id}`);
      return response.data;
    },
    create: async (data: DoctorRequest): Promise<DoctorResponse> => {
      const response = await apiClient.post("/api/management/doctors", data);
      return response.data;
    },
    update: async (id: string, data: Partial<DoctorRequest>): Promise<DoctorResponse> => {
      const response = await apiClient.patch(`/api/management/doctors/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/management/doctors/${id}`);
    },
  },
};