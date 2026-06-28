// app/(dashboard)/pets/[id]/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { petsApi } from "@/lib/api/pets";
import { PetForm } from "@/components/pets/PetForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MedicalRecordView } from "@/components/pets/MedicalRecordView";
import { QRCodeDisplay } from "@/components/pets/QRCodeDisplay";

interface PageProps {
  params: Promise<{ id: string }>;
}

const breedLabels: Record<string, string> = {
  persian: "Персидская",
  siamese: "Сиамская",
  maine_coon: "Мейн-кун",
  british: "Британская",
  labrador: "Лабрадор",
  german_shepherd: "Немецкая овчарка",
  bulldog: "Бульдог",
  poodle: "Пудель",
};

export default async function PetDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  let pet;
  try {
    pet = await petsApi.getPetById(id);
  } catch (error) {
    console.error("Failed to fetch pet:", error);
    redirect("/pets");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {pet.name} – {pet.species === "cat" ? "Кошка" : pet.species === "dog" ? "Собака" : pet.species} ({breedLabels[pet.breed] || pet.breed})
      </h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Основная информация</TabsTrigger>
          <TabsTrigger value="medical">Медицинская карта</TabsTrigger>
          <TabsTrigger value="qr">QR-код</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <PetForm ownerId={session.user.id} initialData={pet} />
        </TabsContent>
        <TabsContent value="medical">
          <MedicalRecordView record={pet.medicalRecord} />
        </TabsContent>
        <TabsContent value="qr">
          <QRCodeDisplay petId={pet.id} qrCode={pet.qrCode} />
        </TabsContent>
      </Tabs>
    </div>
  );
}