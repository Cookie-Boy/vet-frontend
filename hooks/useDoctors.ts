// hooks/useDoctors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorsApi } from "@/lib/api/doctors";
import { DoctorRequest, DoctorResponse } from "@/types/doctor";
import apiClient from "@/lib/api/client";

export const useDoctors = () => {
  return useQuery({
    queryKey: ["doctors"],
    queryFn: () => doctorsApi.client.getAll(),
  });
};

export const useDoctor = (id?: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: () => doctorsApi.server.getById(id!),
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: DoctorRequest) => doctorsApi.client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useUpdateDoctor = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<DoctorRequest>) => doctorsApi.client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
      queryClient.invalidateQueries({ queryKey: ["doctor", id] });
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => doctorsApi.client.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctors"] });
    },
  });
};

export const useDoctorsByClinic = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["doctors", clinicId],
    queryFn: async (): Promise<DoctorResponse[]> => {
      if (clinicId) {
        const response = await apiClient.get(`/api/management/doctors/clinic/${clinicId}`);
        return response.data;
      } else {
        const response = await apiClient.get("/api/management/doctors");
        return response.data;
      }
    },
  });
};