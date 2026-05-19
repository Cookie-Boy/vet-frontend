// app/(dashboard)/doctors/[id]/edit/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { doctorsApi } from "@/lib/api/doctors";
import { AddDoctorForm } from "@/components/doctors/AddDoctorForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) redirect("/doctors");

  const { id } = await params;
  let doctor;
  try {
    doctor = await doctorsApi.server.getById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование врача</h1>
      <AddDoctorForm initialData={doctor} />
    </div>
  );
}