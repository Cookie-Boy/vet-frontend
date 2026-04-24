// app/(dashboard)/appointments/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { appointmentsApi } from "@/lib/api/appointments";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  let appointments: any[] | undefined;
  try {
    // Предположим, есть эндпоинт /api/appointment?ownerId=...
    let ownerId = session.user.id;
    appointments = await appointmentsApi.server.getAppointments(ownerId);
  } catch (error) {
    appointments = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Записи на приём</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте вашими визитами к ветеринарам
          </p>
        </div>
        <Button>
          <Link href="/appointments/new">
            <Plus className="mr-2 h-4 w-4" />
            Записаться
          </Link>
        </Button>
      </div>

      <AppointmentList appointments={appointments} />
    </div>
  );
}