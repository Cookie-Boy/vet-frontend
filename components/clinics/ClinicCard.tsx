// components/clinics/ClinicCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Phone, MapPin, Edit, Trash2 } from "lucide-react";
import { ClinicResponse } from "@/types/clinic";
import { useDeleteClinic } from "@/hooks/useClinics";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface ClinicCardProps {
  clinic: ClinicResponse;
  isAdmin: boolean;
}

export function ClinicCard({ clinic, isAdmin }: ClinicCardProps) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const deleteClinic = useDeleteClinic();

  const handleDelete = async () => {
    try {
      await deleteClinic.mutateAsync(clinic.id);
      toast.success("Клиника удалена");
      router.refresh();
    } catch {
      toast.error("Ошибка при удалении");
    } finally {
      setShowDelete(false);
    }
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {clinic.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {clinic.address}
          </div>
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {clinic.phone}
          </div>
        </CardContent>
        {isAdmin && (
          <CardFooter className="mt-auto flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/clinics/${clinic.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Редактировать
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Удалить
            </Button>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить клинику «{clinic.name}»?</AlertDialogTitle>
            <AlertDialogDescription>Это действие необратимо.</AlertDialogDescription>
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