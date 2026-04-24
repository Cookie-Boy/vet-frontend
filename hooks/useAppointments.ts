// hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, AppointmentFilters } from "@/lib/api/appointments";
import { AppointmentRequest } from "@/types/appointment";

export const useAppointments = (filters: AppointmentFilters) => {
  return useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => appointmentsApi.client.getAppointments(filters),
    enabled: !!filters.patientId || !!filters.doctorId, // включаем только если есть фильтр
  });
};

export const usePatientAppointments = (patientId?: string) => {
  return useQuery({
    queryKey: ["appointments", "patient", patientId],
    queryFn: () => appointmentsApi.client.getByPatient(patientId!),
    enabled: !!patientId,
  });
};

export const useAvailableSlots = (doctorId: string | null, date: string) => {
  return useQuery({
    queryKey: ["slots", doctorId, date],
    queryFn: () => appointmentsApi.server.getAvailableSlots(doctorId, date),
    enabled: !!date,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentRequest) => appointmentsApi.client.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appointmentsApi.client.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};