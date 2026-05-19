// components/appointments/AppointmentList.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, PawPrint, XCircle, CheckCircle, Trash2, Plus } from "lucide-react";
import { AppointmentResponse } from "@/types/appointment";
import { useCancelAppointment } from "@/hooks/useAppointments";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CompleteAppointmentDialog } from "./CompleteAppointmentDialog";
import { AppointmentFilters } from "./AppointmentFilters";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AppointmentListProps {
  appointments: AppointmentResponse[];
  userRole: "OWNER" | "DOCTOR" | "ADMIN";
  userId: string;
}

export function AppointmentList({ appointments, userRole, userId }: AppointmentListProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [filterDoctorId, setFilterDoctorId] = useState<string>("all");
  const [filterOwnerId, setFilterOwnerId] = useState<string>("all");
  const [completingAppointment, setCompletingAppointment] = useState<AppointmentResponse | null>(null);

  const cancelAppointment = useCancelAppointment();
  const isOwner = userRole === "OWNER";
  const isDoctor = userRole === "DOCTOR";
  const isAdmin = userRole === "ADMIN";

  const now = new Date();

  // Фильтрация для админа
  const filteredAppointments = isAdmin
    ? appointments.filter((a) => {
        const matchesDoctor = filterDoctorId === "all" || a.doctorId === filterDoctorId;
        const matchesOwner = filterOwnerId === "all" || a.ownerId === filterOwnerId;
        return matchesDoctor && matchesOwner;
      })
    : appointments;

  const upcoming = filteredAppointments.filter(
    (a) => new Date(a.startTime) > now && a.status === "PENDING"
  );
  const past = filteredAppointments.filter(
    (a) => new Date(a.startTime) <= now || a.status !== "PENDING"
  );

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment.mutateAsync(id);
      toast.success("Запись отменена");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось отменить запись");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="default">Ожидается</Badge>;
      case "CANCELLED":
        return <Badge variant="destructive">Отменена</Badge>;
      case "COMPLETED":
        return <Badge variant="secondary">Завершена</Badge>;
      default:
        return null;
    }
  };

  const renderAppointmentCard = (appointment: AppointmentResponse) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {format(new Date(appointment.startTime), "d MMMM yyyy", { locale: ru })}
          </CardTitle>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 text-sm">
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            {format(new Date(appointment.startTime), "HH:mm")} –{" "}
            {format(new Date(appointment.endTime), "HH:mm")}
          </div>
          {(isDoctor || isAdmin) && (
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4 text-muted-foreground" />
              Владелец: {appointment.ownerFullName || "Не указан"}
            </div>
          )}
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Врач: {appointment.doctorFullName || "Не назначен"}
          </div>
          {appointment.petFullName && (
            <div className="flex items-center">
              <PawPrint className="mr-2 h-4 w-4 text-muted-foreground" />
              Питомец: {appointment.petFullName}
            </div>
          )}
          {appointment.metadata?.comment && (
            <p className="text-muted-foreground mt-2 italic">
              "{appointment.metadata.comment}"
            </p>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          {isOwner && appointment.status === "PENDING" && (
            <Button variant="outline" size="sm" onClick={() => handleCancel(appointment.id)}>
              <XCircle className="mr-2 h-4 w-4" />
              Отменить
            </Button>
          )}
          {isDoctor && appointment.status === "PENDING" && (
            <Button variant="default" size="sm" onClick={() => setCompletingAppointment(appointment)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Завершить приём
            </Button>
          )}
          {isAdmin && (
            <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {isDoctor ? "Мои приёмы" : isAdmin ? "Все приёмы" : "Мои записи"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isDoctor
              ? "Пациенты, записанные к вам"
              : isAdmin
              ? "Управление всеми записями клиники"
              : "Управляйте вашими визитами к ветеринарам"}
          </p>
        </div>
        {isOwner && (
            <Link href="/appointments/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Записаться
              </Button>
            </Link>
        )}
      </div>

      {isAdmin && (
        <AppointmentFilters
          doctorId={filterDoctorId}
          onDoctorChange={setFilterDoctorId}
          ownerId={filterOwnerId}
          onOwnerChange={setFilterOwnerId}
        />
      )}

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Предстоящие ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">История ({past.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="pt-4">
          {upcoming.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Нет предстоящих записей
            </p>
          ) : (
            upcoming.map(renderAppointmentCard)
          )}
        </TabsContent>
        <TabsContent value="past" className="pt-4">
          {past.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              История записей пуста
            </p>
          ) : (
            past.map(renderAppointmentCard)
          )}
        </TabsContent>
      </Tabs>

      {completingAppointment && (
        <CompleteAppointmentDialog
          appointment={completingAppointment}
          open={!!completingAppointment}
          onClose={() => setCompletingAppointment(null)}
        />
      )}
    </>
  );
}