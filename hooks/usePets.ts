// hooks/usePets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { petsApi } from "@/lib/api/pets";
import { PetRequest } from "@/types/pet";

export const usePets = (ownerId?: string) => {
  return useQuery({
    queryKey: ["pets", ownerId],
    queryFn: () => petsApi.getPetsByOwnerId(ownerId!),
    enabled: !!ownerId,
  });
};

export const usePet = (petId?: string) => {
  return useQuery({
    queryKey: ["pet", petId],
    queryFn: () => petsApi.getPetById(petId!),
    enabled: !!petId,
  });
};

export const useCreatePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PetRequest) => petsApi.createPet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};

export const useUpdatePet = (petId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<PetRequest>) => petsApi.updatePet(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (petId: string) => petsApi.deletePet(petId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
};