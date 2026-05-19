// components/appointments/AppointmentFilters.tsx
"use client";

import { useDoctors } from "@/hooks/useDoctors";
import { useOwners } from "@/hooks/useOwners";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AppointmentFiltersProps {
  doctorId: string;
  onDoctorChange: (id: string) => void;
  ownerId: string;
  onOwnerChange: (id: string) => void;
}

export function AppointmentFilters({
  doctorId,
  onDoctorChange,
  ownerId,
  onOwnerChange,
}: AppointmentFiltersProps) {
  const { data: doctors } = useDoctors();
  const { data: owners } = useOwners();

  return (
    <div className="flex gap-4 mb-4 flex-wrap">
      <div className="w-64">
        <Label>Фильтр по врачу</Label>
        <Select value={doctorId} onValueChange={(value) => onDoctorChange(value || "allDoctors")}>
          <SelectTrigger>
            <SelectValue placeholder="Все врачи" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все врачи</SelectItem>
            {doctors?.map((doc) => (
              <SelectItem key={doc.id} value={doc.id}>
                {doc.lastName} {doc.firstName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-64">
        <Label>Фильтр по владельцу</Label>
        <Select value={ownerId} onValueChange={(value) => onOwnerChange(value || "allOwners")}>
          <SelectTrigger>
            <SelectValue placeholder="Все владельцы" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все владельцы</SelectItem>
            {owners?.map((owner) => (
              <SelectItem key={owner.id} value={owner.id}>
                {owner.firstName} {owner.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}