import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { MedicationFilters } from "@/components/medications/MedicationFilters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MedicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isAdmin = session?.user?.isAdmin || false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Склад лекарств</h1>
          <p className="text-muted-foreground mt-1">
            Управление запасами медикаментов
          </p>
        </div>
        {isAdmin && (
          <Button>
              <Link href="/medications/new">
                <Plus className="mr-2 h-4 w-4" />
                Добавить лекарство
              </Link>
          </Button>
        )}
      </div>

      <MedicationFilters />
    </div>
  );
}