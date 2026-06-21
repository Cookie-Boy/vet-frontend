// components/doctors/DoctorCard.tsx
"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, Phone, Stethoscope, Edit, Trash2, Eye, Building2 } from "lucide-react";
import { DoctorResponse, getSpecializationLabel } from "@/types/doctor";
import Link from "next/link";
import { useState } from "react";
import { useDeleteDoctor } from "@/hooks/useDoctors";
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

interface DoctorCardProps {
  doctor: DoctorResponse;
  isAdmin?: boolean;
}

export function DoctorCard({ doctor, isAdmin }: DoctorCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteDoctor = useDeleteDoctor();

  const fullName = `${doctor.lastName} ${doctor.firstName} ${doctor.middleName || ""}`.trim();

  const handleDelete = async () => {
    try {
      await deleteDoctor.mutateAsync(doctor.id);
      toast.success("Врач удалён");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось удалить врача");
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">{fullName}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Stethoscope className="mr-1 h-3 w-3" />
            {getSpecializationLabel(doctor.specialization)}
          </div>
          {doctor.clinicName && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Building2 className="mr-1 h-3 w-3" />
              {doctor.clinicName}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {doctor.phoneNumber}
          </div>
          <div className="flex items-center">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {doctor.email}
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            {doctor.startWorkingDay?.slice(0, 5)} – {doctor.endWorkingDay?.slice(0, 5)}
          </div>
          {doctor.bio && <p className="text-xs text-muted-foreground line-clamp-2">{doctor.bio}</p>}
        </CardContent>
        <CardFooter className="mt-auto flex gap-2 items-center">
          <Link href={`/appointments/new?doctorId=${doctor.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Записаться
            </Button>
          </Link>
          
          <Link href={`/doctors/${doctor.id}`}>
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          
          {isAdmin && (
            <>
              <Link href={`/doctors/${doctor.id}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              
              <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить врача?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить врача {fullName}? Это действие нельзя отменить.
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