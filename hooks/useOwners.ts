// hooks/useOwners.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { OwnerResponse } from "@/types/pet";

export const useOwners = () => {
  return useQuery({
    queryKey: ["owners"],
    queryFn: async () => {
      const response = await apiClient.get("/api/profile/owners");
      return response.data as OwnerResponse[];
    },
  });
};