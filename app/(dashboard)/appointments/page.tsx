// app/(dashboard)/appointments/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { appointmentsApi } from "@/lib/api/appointments";
import { AppointmentList } from "@/components/appointments/AppointmentList";
import { AppointmentResponse } from "@/types/appointment";

export default async function AppointmentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isDoctor = session.user.isDoctor ?? session.user.roles?.includes("DOCTOR");
  const isAdmin = session.user.isAdmin ?? session.user.roles?.includes("ADMIN");

  let appointments: AppointmentResponse[];
  try {
    if (isDoctor) {
      appointments = await appointmentsApi.server.getByDoctor(session.user.id!);
    } else if (isAdmin) {
      appointments = await appointmentsApi.server.getAll();
    } else {
      appointments = await appointmentsApi.server.getByOwner(session.user.id!);
    }
  } catch (error) {
    appointments = [];
  }

  return (
    <div className="space-y-6">
      <AppointmentList
        appointments={appointments}
        userRole={isAdmin ? "ADMIN" : isDoctor ? "DOCTOR" : "OWNER"}
        userId={session.user.id!}
      />
    </div>
  );
}