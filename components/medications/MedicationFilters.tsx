"use client";

import { useState } from "react";
import { useClinics } from "@/hooks/useClinics";
import { useMedicationsByClinic } from "@/hooks/useMedications";
import { MedicationTable } from "./MedicationTable";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "next-auth/react";

export function MedicationFilters() {
  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);
  const { data: clinics } = useClinics();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin ?? false;

  const clinicId = selectedClinicId === "all" ? null : selectedClinicId;
  const { data: medications, isLoading } = useMedicationsByClinic(clinicId);

  if (isLoading) return <p className="text-muted-foreground">Загрузка...</p>;

  return (
    <>
      {isAdmin && (
        <div className="flex items-center gap-4 mb-4">
          <Label>Фильтр по клинике</Label>
          <Select value={selectedClinicId} onValueChange={setSelectedClinicId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Все клиники" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все клиники</SelectItem>
              {clinics?.map((clinic) => (
                <SelectItem key={clinic.id} value={String(clinic.id)}>
                    {clinic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <MedicationTable medications={medications || []} isAdmin={isAdmin} />
    </>
  );
}