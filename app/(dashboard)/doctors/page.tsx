// app/(dashboard)/doctors/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { doctorsApi } from "@/lib/api/doctors";
import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DoctorsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const isAdmin = session?.user?.isAdmin || false;

  try {
    const doctors = await doctorsApi.server.getAll();

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

        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">В клинике пока нет зарегистрированных врачей</p>
            {isAdmin && (
              <Button variant="link" className="mt-2">
                <Link href="/doctors/new">Добавить первого врача</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} isAdmin={isAdmin} />
            ))}
          </div>
        )}
      </div>
    );
  } catch (error: any) {
    console.error("Error in DoctorsPage:", error);
    
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Врачи клиники</h1>
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Не удалось загрузить список врачей</h2>
          <p className="text-sm">Сервис временно недоступен. Пожалуйста, попробуйте позже.</p>
        </div>
      </div>
    );
  }
}