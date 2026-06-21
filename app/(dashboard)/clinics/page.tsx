import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { clinicsApi } from "@/lib/api/clinics";
import { ClinicCard } from "@/components/clinics/ClinicCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Building2 } from "lucide-react";

export default async function ClinicsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isAdmin) redirect("/");

  const clinics = await clinicsApi.server.getAll().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Клиники</h1>
          <p className="text-muted-foreground mt-1">Управление филиалами ветеринарной сети</p>
        </div>
        <Link href="/clinics/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Добавить клинику
          </Button>
        </Link>
      </div>
      {clinics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="mx-auto h-8 w-8 mb-2" />
          <p>Нет добавленных клиник</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clinics.map((c) => (
            <ClinicCard key={c.id} clinic={c} isAdmin={true} />
          ))}
        </div>
      )}
    </div>
  );
}