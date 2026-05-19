// hooks/useUserSearch.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

export interface UserSearchResult {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

async function searchUsers(query: string): Promise<UserSearchResult[]> {
  if (!query || query.length < 2) return [];
  const response = await apiClient.get("/api/profile/owners/search", {
    params: { query: query },
  });
  return response.data;
}

export const useUserSearch = (query: string) => {
  return useQuery({
    queryKey: ["userSearch", query],
    queryFn: () => searchUsers(query),
    enabled: query.length >= 2,
    staleTime: 60_000,
  });
};