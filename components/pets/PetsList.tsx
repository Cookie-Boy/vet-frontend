"use client";
import { PetResponse } from "@/types/pet";
import { PetCard } from "./PetCard";

interface PetsListProps { pets: PetResponse[]; ownerId: string; }
export function PetsList({ pets, ownerId }: PetsListProps) {
  if (pets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">У вас пока нет зарегистрированных питомцев</p>
      </div>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
    </div>
  );
}