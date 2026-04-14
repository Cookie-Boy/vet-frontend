// app/(dashboard)/pets/new/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { PetForm } from "@/components/pets/PetForm";

export default async function NewPetPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Добавить питомца</h1>
      <PetForm ownerId={session.user.id} />
    </div>
  );
}