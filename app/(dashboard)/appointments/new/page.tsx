// app/(dashboard)/appointments/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { petsApi } from "@/lib/api/pets";

export default async function NewAppointmentPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const pets = await petsApi.getPetsByOwnerId(session.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Запись на приём</h1>
      <AppointmentForm ownerId={session.user.id} pets={pets} />
    </div>
  );
}