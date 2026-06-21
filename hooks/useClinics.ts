// hooks/useClinics.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsApi } from "@/lib/api/clinics";
import { ClinicRequest } from "@/types/clinic";

export const useClinics = () => {
  return useQuery({
    queryKey: ["clinics"],
    queryFn: () => clinicsApi.client.getAll(),
  });
};

export const useClinic = (id?: string) => {
  return useQuery({
    queryKey: ["clinic", id],
    queryFn: () => clinicsApi.client.getById(id!),
    enabled: !!id,
  });
};

export const useCreateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClinicRequest) => clinicsApi.client.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clinics"] }),
  });
};

export const useUpdateClinic = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ClinicRequest) => clinicsApi.client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["clinic", id] });
    },
  });
};

export const useDeleteClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicsApi.client.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["clinics"] }),
  });
};