"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { PetResponse } from "@/types/pet";
import { useDeletePet } from "@/hooks/usePets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const breedLabels: Record<string, string> = {
  persian: "Персидская", siamese: "Сиамская", maine_coon: "Мейн-кун",
  british: "Британская", labrador: "Лабрадор", german_shepherd: "Немецкая овчарка",
  bulldog: "Бульдог", poodle: "Пудель",
};

interface PetCardProps { pet: PetResponse; }

export function PetCard({ pet }: PetCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const deletePet = useDeletePet();

  const handleDelete = async () => {
    try {
      await deletePet.mutateAsync(pet.id);
      toast.success("Питомец удалён");
      router.refresh();
    } catch {
      toast.error("Не удалось удалить питомца");
    } finally { setShowDelete(false); }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">{pet.name}</CardTitle>
          <PawPrint className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {pet.species === "cat" ? "Кошка" : "Собака"} • {breedLabels[pet.breed] || pet.breed}
          </div>
          <div className="text-sm text-muted-foreground">
            Возраст: {pet.age} {pet.age === 1 ? "год" : pet.age < 5 ? "года" : "лет"}
          </div>
          {pet.chipNumber && (
            <div className="text-sm text-muted-foreground">Чип: {pet.chipNumber}</div>
          )}
        </CardContent>
        <CardFooter className="mt-auto flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Link href={`/pets/${pet.id}`}>Подробнее</Link>
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить питомца?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить питомца {pet.name}? Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}