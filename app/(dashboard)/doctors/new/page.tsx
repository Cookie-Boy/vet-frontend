// app/(dashboard)/doctors/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { DoctorForm } from "@/components/doctors/DoctorForm";

export default async function NewDoctorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/doctors");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добавить врача</h1>
      <DoctorForm />
    </div>
  );
}