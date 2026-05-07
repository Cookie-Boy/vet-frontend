import { createServerApiClient } from "@/lib/api/server-client";
import { OwnerResponse, OwnerRequest } from "@/types/pet";
import apiClient from "@/lib/api/client"

export const profileApi = {
  getOwner: async (ownerId: string): Promise<OwnerResponse> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/owners/${ownerId}`);
    return response.data;
  },

  updateOwner: async (ownerId: string, data: Partial<OwnerRequest>): Promise<OwnerResponse> => {
    const response = await apiClient.put(`/api/profile/update`, data);
    return response.data;
  },

  getOwnerByVkUserId: async (vkUserId: string): Promise<OwnerResponse> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/owners/by-tg-chat-id`, {
      params: { vkUserId },
    });
    return response.data;
  },

  getVkUserIdByOwnerId: async (ownerId: string): Promise<string> => {
    const serverClient = await createServerApiClient();
    const response = await serverClient.get(`/api/profile/owners/${ownerId}/tg-chat-id`);
    return response.data;
  },
};