// lib/api/medications.ts
import { MedicationResponse, MedicationRequest } from "@/types/medication";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const medicationsApi = {
  // Серверные методы (для Server Components)
  server: {
    getAll: async (): Promise<MedicationResponse[]> => {
      const client = await createServerApiClient();
      const response = await client.get("/api/management/medicines");
      return response.data;
    },
    getById: async (id: string): Promise<MedicationResponse> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/management/medicines/${id}`);
      return response.data;
    },
  },

  // Клиентские методы (для Client Components)
  client: {
    getAll: async (): Promise<MedicationResponse[]> => {
      const response = await apiClient.get("/api/management/medicines");
      return response.data;
    },
    getById: async (id: string): Promise<MedicationResponse> => {
      const response = await apiClient.get(`/api/management/medicines/${id}`);
      return response.data;
    },
    create: async (data: MedicationRequest): Promise<MedicationResponse> => {
      const response = await apiClient.post("/api/management/medicines", data);
      return response.data;
    },
    update: async (id: string, data: Partial<MedicationRequest>): Promise<MedicationResponse> => {
      const response = await apiClient.patch(`/api/management/medicines/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/management/medicines/${id}`);
    },
  },
};