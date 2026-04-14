// components/pets/PetCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Eye } from "lucide-react";
import Link from "next/link";
import { PetResponse } from "@/types/pet";

interface PetCardProps {
  pet: PetResponse;
}

export function PetCard({ pet }: PetCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{pet.name}</CardTitle>
        <PawPrint className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {pet.species === "cat" ? "Кошка" : "Собака"} • {pet.breed}
        </div>
        <div className="text-sm text-muted-foreground">
          Возраст: {pet.age} {pet.age === 1 ? "год" : pet.age < 5 ? "года" : "лет"}
        </div>
        {pet.chipNumber && (
          <div className="text-sm text-muted-foreground">Чип: {pet.chipNumber}</div>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Link href={`/pets/${pet.id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Подробнее
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}