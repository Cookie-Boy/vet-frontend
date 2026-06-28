// lib/api/pets.ts
import { PetResponse, PetRequest } from "@/types/pet";
import apiClient from "./client";
import { createServerApiClient } from "./server-client";

export const petsApi = {
  getPetsByOwnerId: async (ownerId: string): Promise<PetResponse[]> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/pets/owner/${ownerId}`);
    return response.data;
  },

  getPetById: async (petId: string): Promise<PetResponse> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/pets/${petId}`);
    return response.data;
  },

  getPetByQrCode: async (qrCode: string): Promise<PetResponse> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/pets/qrcode/${qrCode}`);
    return response.data;
  },

  createPet: async (data: PetRequest): Promise<PetResponse> => {
    const response = await apiClient.post(`/api/profile/pets`, data);
    return response.data;
  },

  updatePet: async (petId: string, data: Partial<PetRequest>): Promise<PetResponse> => {
    const response = await apiClient.put(`/api/profile/pets/${petId}`, data);
    return response.data;
  },

  deletePet: async (petId: string): Promise<void> => {
    await apiClient.delete(`/api/profile/pets/${petId}`);
  },

  getPetQrCodeUrl: (petId: string, width: number = 300, height: number = 300): string => {
  return `/api/profile/pets/${petId}/qrcode?width=${width}&height=${height}`;
},
};