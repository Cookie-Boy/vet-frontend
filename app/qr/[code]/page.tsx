// app/qr/[code]/page.tsx
import { petsApi } from "@/lib/api/pets";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QrScanPage({ params }: { params: { code: string } }) {
  try {
    const pet = await petsApi.getPetByQrCode(params.code);

    return (
      <div className="container mx-auto py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Экстренная карта питомца</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Вид:</div>
              <div>{pet.species}</div>
              <div className="font-medium">Порода:</div>
              <div>{pet.breed}</div>
              <div className="font-medium">Возраст:</div>
              <div>{pet.age} {pet.age === 1 ? "год" : pet.age < 5 ? "года" : "лет"}</div>
              {pet.chipNumber && (
                <>
                  <div className="font-medium">Номер чипа:</div>
                  <div>{pet.chipNumber}</div>
                </>
              )}
            </div>
            {pet.medicalRecord && (
              <>
                <h3 className="font-semibold text-lg mt-4">Медицинская информация</h3>
                {pet.medicalRecord.allergies && pet.medicalRecord.allergies.length > 0 && (
                  <div>
                    <span className="font-medium">Аллергии:</span> {pet.medicalRecord.allergies.join(", ")}
                  </div>
                )}
                {pet.medicalRecord.chronicDiseases && pet.medicalRecord.chronicDiseases.length > 0 && (
                  <div>
                    <span className="font-medium">Хронические заболевания:</span> {pet.medicalRecord.chronicDiseases.join(", ")}
                  </div>
                )}
              </>
            )}
            <p className="text-sm text-muted-foreground mt-4">
              Владелец: {pet.ownerId} (контактные данные скрыты)
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    notFound();
  }
}