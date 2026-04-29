// lib/api/health.ts
import { AnalyzedVitals, VitalsReading, HealthRecommendation } from "@/types/health";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const healthApi = {
  server: {
    getVitalsHistory: async (petId: string, period: string = "day"): Promise<AnalyzedVitals[]> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/health/vitals/${petId}`, { params: { period } });
      return response.data;
    },
    getLatestVitals: async (petId: string): Promise<AnalyzedVitals & { collarStatus: 'online' | 'offline' }> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/health/vitals/${petId}/latest`);
      return response.data;
    },
    getRecommendations: async (petId: string): Promise<HealthRecommendation[]> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/health/recommendations/${petId}`);
      return response.data;
    },
    requestAnalysis: async (petId: string): Promise<HealthRecommendation> => {
      const client = await createServerApiClient();
      const response = await client.post(`/api/health/analyze/${petId}`);
      return response.data;
    },
  },
  client: {
    getVitalsHistory: async (petId: string, period: string = "day"): Promise<AnalyzedVitals[]> => {
      const response = await apiClient.get(`/api/health/vitals/${petId}`, { params: { period } });
      return response.data;
    },
    getLatestVitals: async (petId: string): Promise<AnalyzedVitals & { collarStatus: 'online' | 'offline' }> => {
      const response = await apiClient.get(`/api/health/vitals/${petId}/latest`);
      return response.data;
    },
    getRecommendations: async (petId: string): Promise<HealthRecommendation[]> => {
      const response = await apiClient.get(`/api/health/recommendations/${petId}`);
      return response.data;
    },
    requestAnalysis: async (petId: string): Promise<HealthRecommendation> => {
      const response = await apiClient.post(`/api/health/analyze/${petId}`);
      return response.data;
    },
  },
};