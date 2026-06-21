// hooks/useMedications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationsApi } from "@/lib/api/medications";
import { MedicationRequest } from "@/types/medication";

export const useMedications = () => {
  return useQuery({
    queryKey: ["medications"],
    queryFn: () => medicationsApi.client.getAll(),
  });
};

export const useMedicationsByClinic = (clinicId: string | null) => {
  return useQuery({
    queryKey: ["medications", clinicId],
    queryFn: () => medicationsApi.client.getAll(clinicId ?? undefined),
    enabled: true, // загружаем всегда, при null вернутся все лекарства
  });
};

export const useMedication = (id?: string) => {
  return useQuery({
    queryKey: ["medication", id],
    queryFn: () => medicationsApi.client.getById(id!),
    enabled: !!id,
  });
};

export const useCreateMedication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicationRequest) => medicationsApi.client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
};

export const useUpdateMedication = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MedicationRequest>) => medicationsApi.client.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
      queryClient.invalidateQueries({ queryKey: ["medication", id] });
    },
  });
};

export const useDeleteMedication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicationsApi.client.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications"] });
    },
  });
};