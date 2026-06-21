import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { ClinicForm } from "@/components/clinics/ClinicForm";

export default async function NewClinicPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) redirect("/");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добавить клинику</h1>
      <ClinicForm />
    </div>
  );
}