// app/(dashboard)/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { petsApi } from "@/lib/api/pets";
import { appointmentsApi } from "@/lib/api/appointments";
import { medicationsApi } from "@/lib/api/medications";
import { healthApi } from "@/lib/api/health";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { PetsSummary } from "@/components/dashboard/PetsSummary";
import { HealthAlerts } from "@/components/dashboard/HealthAlerts";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import type { AnalyzedVitals } from "@/types/health";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ownerId = session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  const [pets, medications] = await Promise.all([
    petsApi.getPets(ownerId).catch(() => []),
    medicationsApi.server.getAll().catch(() => [])
  ]);

  let allAppointments: any[] | undefined;
  try {
    let ownerId = session.user.id;
    allAppointments = await appointmentsApi.server.getAppointments(ownerId);
    console.log("Fetching appointments for dashboard...");
    console.log(allAppointments);
  } catch (error) {
    console.log("Error cought");
    console.log(error);
    allAppointments = [];
  }

  const pendingAppointments = allAppointments
    .flat()
    .filter(a => a.status === "PENDING" && new Date(a.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  const vitalsPromises = pets.map(pet =>
    healthApi.server.getLatestVitals(pet.id).catch(() => null)
  );
  const latestVitals = (await Promise.all(vitalsPromises)).filter(Boolean) as (AnalyzedVitals & { collarStatus?: string })[];
  const healthAlerts = latestVitals
    .filter(v => v.isAnomalous)
    .map(v => ({
      petId: v.petId,
      petName: pets.find(p => p.id === v.petId)?.name ?? "Питомец",
      reason: v.anomalyReason ?? "Аномалия",
      timestamp: v.timestamp
    }));

  const lowStockMedications = medications.filter(m => m.quantityInStock < m.minStockLevel);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Добро пожаловать, {session.user.name ?? "Пользователь"}!</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="md:col-span-2 lg:col-span-3">
          <PetsSummary pets={pets} />
        </div>
        <div className="lg:col-span-2">
          <UpcomingAppointments appointments={allAppointments} />
        </div>
        <div>
          <HealthAlerts alerts={healthAlerts} />
        </div>
        {isAdmin && (
          <div className="lg:col-span-3">
            <InventoryStatus medications={lowStockMedications} />
          </div>
        )}
      </div>
    </div>
  );
}