// hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "@/lib/api/reviews";
import { CreateReviewRequest } from "@/types/doctor";

export const useReviews = (doctorId: string) => {
  return useQuery({
    queryKey: ["reviews", doctorId],
    queryFn: () => reviewsApi.client.getByDoctorId(doctorId),
    enabled: !!doctorId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsApi.client.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.doctorId] });
    },
  });
};