// components/appointments/AppointmentList.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, User, PawPrint, XCircle } from "lucide-react";
import { AppointmentResponse } from "@/types/appointment";
import { useCancelAppointment } from "@/hooks/useAppointments";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface AppointmentListProps {
  appointments: AppointmentResponse[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const [activeTab, setActiveTab] = useState("upcoming");
  const cancelAppointment = useCancelAppointment();

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.startTime) > now && a.status === "BOOKED"
  );
  const past = appointments.filter(
    (a) => new Date(a.startTime) <= now || a.status !== "BOOKED"
  );

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointment.mutateAsync(id);
      toast.success("Запись отменена");
    } catch (error) {
      toast.error("Не удалось отменить запись");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "BOOKED":
        return <Badge variant="default">Запланирована</Badge>;
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
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4 text-muted-foreground" />
            Врач: {appointment.doctorFullName || "Не назначен"}
          </div>
          {appointment.patientFullName && (
            <div className="flex items-center">
              <PawPrint className="mr-2 h-4 w-4 text-muted-foreground" />
              Питомец: {appointment.patientFullName}
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            Клиника: {appointment.clinicName || "Основное отделение"}
          </div>
          {appointment.metadata?.comment && (
            <p className="text-muted-foreground mt-2 italic">
              "{appointment.metadata.comment}"
            </p>
          )}
        </div>
        {appointment.status === "BOOKED" && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancel(appointment.id)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Отменить запись
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="upcoming">Предстоящие ({upcoming.length})</TabsTrigger>
        <TabsTrigger value="past">История ({past.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="pt-4">
        {upcoming.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            У вас нет предстоящих записей
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
  );
}