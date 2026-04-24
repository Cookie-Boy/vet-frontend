// lib/api/reviews.ts
import { Review, CreateReviewRequest } from "@/types/doctor";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const reviewsApi = {
  server: {
    getByDoctorId: async (doctorId: string): Promise<Review[]> => {
      const client = await createServerApiClient();
      const response = await client.get(`/api/management/doctors/${doctorId}/reviews`);
      return response.data;
    },
  },
  client: {
    getByDoctorId: async (doctorId: string): Promise<Review[]> => {
      const response = await fetch(`/api/reviews?doctorId=${doctorId}`);
      return response.json();
    },
    create: async (data: CreateReviewRequest): Promise<Review> => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create review');
      return response.json();
    },
  },
};