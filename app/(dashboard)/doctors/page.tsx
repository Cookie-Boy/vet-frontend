// app/(dashboard)/doctors/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { clinicsApi } from "@/lib/api/clinics";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DoctorListWithFilters } from "@/components/doctors/DoctorListWithFilters";

export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isAdmin = session?.user?.isAdmin || false;
  const clinics = await clinicsApi.server.getAll().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Врачи клиники</h1>
          <p className="text-muted-foreground mt-1">
            Выберите специалиста и запишитесь на приём
          </p>
        </div>
        {isAdmin && (
          <Link href="/doctors/new">
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Добавить врача
            </Button>
          </Link>
        )}
      </div>

      <DoctorListWithFilters clinics={clinics} isAdmin={isAdmin} />
    </div>
  );
}