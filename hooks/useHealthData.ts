// hooks/useHealthData.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { healthApi } from "@/lib/api/health";

export const useVitalsHistory = (petId?: string, period: string = "day") => {
  return useQuery({
    queryKey: ["vitals", petId, period],
    queryFn: () => healthApi.client.getVitalsHistory(petId!, period),
    enabled: !!petId,
    refetchInterval: 60_000, // автообновление раз в минуту
  });
};

export const useLatestVitals = (petId?: string) => {
  return useQuery({
    queryKey: ["latestVitals", petId],
    queryFn: () => healthApi.client.getLatestVitals(petId!),
    enabled: !!petId,
    refetchInterval: 15_000,
  });
};

export const useRecommendations = (petId?: string) => {
  return useQuery({
    queryKey: ["recommendations", petId],
    queryFn: () => healthApi.client.getRecommendations(petId!),
    enabled: !!petId,
  });
};

export const useRequestAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => healthApi.client.requestAnalysis(petId),
    onSuccess: (_, petId) => {
      queryClient.invalidateQueries({ queryKey: ["recommendations", petId] });
      queryClient.invalidateQueries({ queryKey: ["vitals", petId] });
    },
  });
};