// hooks/useDoctors.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doctorsApi } from "@/lib/api/doctors";
import { DoctorRequest } from "@/types/doctor";

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