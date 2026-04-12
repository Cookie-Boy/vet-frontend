import apiClient from "./client";
import { OwnerResponse, OwnerRequest } from "@/types/pet";

export const profileApi = {
  getOwner: async (ownerId: string): Promise<OwnerResponse> => {
    const response = await apiClient.get(`/api/profile/owners/${ownerId}`);
    return response.data;
  },

  updateOwner: async (ownerId: string, data: Partial<OwnerRequest>): Promise<OwnerResponse> => {
    const response = await apiClient.put(`/api/profile/owners/${ownerId}`, data);
    return response.data;
  },

  getOwnerByTgChatId: async (tgChatId: string): Promise<OwnerResponse> => {
    const response = await apiClient.get(`/api/profile/owners/by-tg-chat-id`, {
      params: { tgChatId },
    });
    return response.data;
  },

  getTgChatIdByOwnerId: async (ownerId: string): Promise<string> => {
    const response = await apiClient.get(`/api/profile/owners/${ownerId}/tg-chat-id`);
    return response.data;
  },
};