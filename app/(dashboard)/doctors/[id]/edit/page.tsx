// app/(dashboard)/doctors/[id]/edit/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { doctorsApi } from "@/lib/api/doctors";
import { DoctorForm } from "@/components/doctors/DoctorForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDoctorPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/doctors");

  const { id } = await params;
  const doctor = await doctorsApi.server.getById(id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование врача</h1>
      <DoctorForm initialData={doctor} />
    </div>
  );
}