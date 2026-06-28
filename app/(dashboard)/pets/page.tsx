import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { petsApi } from "@/lib/api/pets";
import { PetsList } from "@/components/pets/PetsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PetsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");
  const pets = await petsApi.getPetsByOwnerId(session.user.id);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мои питомцы</h1>
          <p className="text-muted-foreground mt-1">Управляйте профилями ваших питомцев</p>
        </div>
        <Button>
          <Link href="/pets/new">
            Добавить питомца
          </Link>
        </Button>
      </div>
      <PetsList pets={pets} ownerId={session.user.id} />
    </div>
  );
}