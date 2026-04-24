// components/medications/MedicationTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { MedicationResponse } from "@/types/medication";
import { useDeleteMedication } from "@/hooks/useMedications";
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

interface MedicationTableProps {
  medications: MedicationResponse[];
  isAdmin?: boolean;
}

export function MedicationTable({ medications, isAdmin = true }: MedicationTableProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteMedication = useDeleteMedication();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedication.mutateAsync(deleteId);
      toast.success("Лекарство удалено");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось удалить лекарство");
    } finally {
      setDeleteId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Производитель</TableHead>
              <TableHead>Количество</TableHead>
              <TableHead>Мин. остаток</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              {isAdmin && <TableHead className="text-right">Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="text-center text-muted-foreground">
                  Нет лекарств на складе
                </TableCell>
              </TableRow>
            ) : (
              medications.map((med) => {
                const needsReorder = med.quantityInStock < med.minStockLevel;
                return (
                  <TableRow key={med.id}>
                    <TableCell className="font-medium">{med.name}</TableCell>
                    <TableCell>{med.manufacturer}</TableCell>
                    <TableCell>{med.quantityInStock}</TableCell>
                    <TableCell>{med.minStockLevel}</TableCell>
                    <TableCell>{formatPrice(med.pricePerUnit)}</TableCell>
                    <TableCell>
                      {needsReorder ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Нужен заказ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          В наличии
                        </Badge>
                      )}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/medications/${med.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(med.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить лекарство?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить это лекарство? Это действие нельзя отменить.
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