// components/dashboard/PetsSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint } from "lucide-react";
import Link from "next/link";
import { PetResponse } from "@/types/pet";

interface PetsSummaryProps {
  pets: PetResponse[];
}

export function PetsSummary({ pets }: PetsSummaryProps) {
  if (pets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Питомцы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">У вас ещё нет питомцев. <Link href="/pets/new" className="underline">Добавить</Link></p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ваши питомцы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 flex-wrap">
          {pets.map(pet => (
            <Link key={pet.id} href={`/pets/${pet.id}`} className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors">
              <PawPrint className="h-4 w-4" />
              <span className="font-medium">{pet.name}</span>
              <span className="text-sm text-muted-foreground">({pet.species === "cat" ? "Кот" : "Собака"})</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}