// app/(dashboard)/health/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { petsApi } from "@/lib/api/pets";
import { HealthDashboard } from "@/components/health/HealthDashboard";

export default async function HealthPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const pets = await petsApi.getPetsByOwnerId(session.user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Мониторинг здоровья</h1>
        <p className="text-muted-foreground mt-1">
          Показатели умных ошейников и рекомендации
        </p>
      </div>

      <HealthDashboard pets={pets} />
    </div>
  );
}