// hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, AppointmentFilters } from "@/lib/api/appointments";
import { AppointmentRequest } from "@/types/appointment";

export const useAppointments = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsApi.client.getAppointments(ownerId),
  });
};

export const useAvailableSlots = (doctorId: string | null, date: string) => {
  return useQuery({
    queryKey: ["slots", doctorId, date],
    queryFn: () => appointmentsApi.client.getAvailableSlots(doctorId, date),
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