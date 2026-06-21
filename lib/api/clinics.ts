// lib/api/clinics.ts
import { ClinicResponse, ClinicRequest } from "@/types/clinic";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const clinicsApi = {
  server: {
    getAll: async (): Promise<ClinicResponse[]> => {
      const client = await createServerApiClient();
      const response = await client.get("/api/management/clinics");
      return response.data;
    },
    getById: async (id: string): Promise<ClinicResponse> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/management/clinics/${id}`);
      return response.data;
    },
  },
  client: {
    getAll: async (): Promise<ClinicResponse[]> => {
      const response = await apiClient.get("/api/management/clinics");
      return response.data;
    },
    getById: async (id: string): Promise<ClinicResponse> => {
      const response = await apiClient.get(`/api/management/clinics/${id}`);
      return response.data;
    },
    create: async (data: ClinicRequest): Promise<ClinicResponse> => {
      const response = await apiClient.post("/api/management/clinics", data);
      return response.data;
    },
    update: async (id: string, data: ClinicRequest): Promise<ClinicResponse> => {
      const response = await apiClient.patch(`/api/management/clinics/${id}`, data);
      return response.data;
    },
    remove: async (id: string): Promise<void> => {
      await apiClient.delete(`/api/management/clinics/${id}`);
    },
  },
};