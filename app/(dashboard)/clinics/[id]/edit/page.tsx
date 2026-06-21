import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { clinicsApi } from "@/lib/api/clinics";
import { ClinicForm } from "@/components/clinics/ClinicForm";

interface PageProps { params: Promise<{ id: string }> }

export default async function EditClinicPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) redirect("/");
  const { id } = await params;
  const clinic = await clinicsApi.server.getById(id).catch(() => notFound());
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактировать клинику</h1>
      <ClinicForm initialData={clinic} />
    </div>
  );
}