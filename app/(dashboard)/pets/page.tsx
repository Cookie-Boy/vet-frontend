// app/(dashboard)/pets/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { petsApi } from "@/lib/api/pets";
import { PetCard } from "@/components/pets/PetCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PetsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const pets = await petsApi.getPets(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мои питомцы</h1>
          <p className="text-muted-foreground mt-1">
            Управляйте профилями ваших питомцев
          </p>
        </div>
        <Button>
          <Link href="/pets/new">
            Добавить питомца
          </Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">У вас пока нет зарегистрированных питомцев</p>
          <Button variant="link" className="mt-2">
            <Link href="/pets/new">Добавить первого питомца</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}