// app/(dashboard)/medications/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { MedicationForm } from "@/components/medications/MedicationForm";

export default async function NewMedicationPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добавить лекарство</h1>
      <MedicationForm />
    </div>
  );
}