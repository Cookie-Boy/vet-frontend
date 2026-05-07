// components/dashboard/UpcomingAppointments.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User } from "lucide-react";
import { AppointmentResponse } from "@/types/appointment";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface UpcomingAppointmentsProps {
  appointments: AppointmentResponse[];
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ближайшие приёмы</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-muted-foreground">Нет предстоящих записей.</p>
        ) : (
          <ul className="space-y-3">
            {appointments.map((app) => (
              <li key={app.id} className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">
                    {format(new Date(app.startTime), "d MMMM, HH:mm", { locale: ru })}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" /> {app.doctorFullName ?? "Врач не назначен"}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {format(new Date(app.startTime), "HH:mm")} – {format(new Date(app.endTime), "HH:mm")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}