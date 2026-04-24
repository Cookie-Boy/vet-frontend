// app/(dashboard)/medications/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { medicationsApi } from "@/lib/api/medications";
import { MedicationTable } from "@/components/medications/MedicationTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function MedicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Пока разрешим всем управлять лекарствами, но можно добавить проверку isAdmin
  const isAdmin = session.user.role === "ADMIN";

  try {
    const medications = await medicationsApi.server.getAll();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Склад лекарств</h1>
            <p className="text-muted-foreground mt-1">
              Управление запасами медикаментов и расходных материалов
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

        <MedicationTable medications={medications} isAdmin={isAdmin} />
      </div>
    );
  } catch (error) {
    console.error("Error in MedicationsPage:", error);
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Склад лекарств</h1>
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Не удалось загрузить список лекарств</h2>
          <p className="text-sm">Сервис временно недоступен. Пожалуйста, попробуйте позже.</p>
        </div>
      </div>
    );
  }
}