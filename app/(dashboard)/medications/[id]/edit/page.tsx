// app/(dashboard)/medications/[id]/edit/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import { medicationsApi } from "@/lib/api/medications";
import { MedicationForm } from "@/components/medications/MedicationForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMedicationPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { id } = await params;
  let medication;
  try {
    medication = await medicationsApi.server.getById(id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактировать лекарство</h1>
      <MedicationForm initialData={medication} />
    </div>
  );
}