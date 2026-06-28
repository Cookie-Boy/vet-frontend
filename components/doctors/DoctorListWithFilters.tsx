// components/doctors/DoctorListWithFilters.tsx
"use client";

import { useState } from "react";
import { useDoctors, useDoctorsByClinic } from "@/hooks/useDoctors";
import { DoctorCard } from "./DoctorCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClinicResponse } from "@/types/clinic";

interface DoctorListWithFiltersProps {
  clinics: ClinicResponse[];
  isAdmin: boolean;
}

export function DoctorListWithFilters({ clinics, isAdmin }: DoctorListWithFiltersProps) {
  const [selectedClinicId, setSelectedClinicId] = useState<string>("all");

  // Явно указываем тип параметра как string | null и преобразуем null в "all"
  const handleClinicChange = (value: string | null) => {
    setSelectedClinicId(value ?? "all");
  };

  // Загружаем всех врачей при "all", иначе врачей конкретной клиники
  const allDoctorsQuery = useDoctors();
  const clinicDoctorsQuery = useDoctorsByClinic(
    selectedClinicId !== "all" ? selectedClinicId : null
  );

  const isLoading =
    selectedClinicId === "all" ? allDoctorsQuery.isLoading : clinicDoctorsQuery.isLoading;
  const doctors =
    selectedClinicId === "all" ? allDoctorsQuery.data : clinicDoctorsQuery.data;

  const selectedClinic = clinics.find(c => c.id === selectedClinicId);

  return (
    <>
      <div className="mb-4 w-64">
        <Label>Фильтр по клинике</Label>
        <Select value={selectedClinicId} onValueChange={handleClinicChange}>
          <SelectTrigger>
            <SelectValue>
              {selectedClinic ? selectedClinic.name : "Все клиники"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все клиники</SelectItem>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading ? (
        <div className="text-center text-muted-foreground">Загрузка...</div>
      ) : doctors && doctors.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} isAdmin={isAdmin} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          {selectedClinicId === "all"
            ? "Нет доступных врачей"
            : "Нет врачей в выбранной клинике"}
        </div>
      )}
    </>
  );
}