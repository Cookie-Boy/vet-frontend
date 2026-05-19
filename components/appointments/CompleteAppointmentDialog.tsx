// components/appointments/CompleteAppointmentDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMedications } from "@/hooks/useMedications";
import { useCompleteAppointment } from "@/hooks/useAppointments";
import { toast } from "sonner";
import { AppointmentResponse } from "@/types/appointment";

interface CompleteAppointmentDialogProps {
  appointment: AppointmentResponse;
  open: boolean;
  onClose: () => void;
}

export function CompleteAppointmentDialog({
  appointment,
  open,
  onClose,
}: CompleteAppointmentDialogProps) {
  const [selectedMeds, setSelectedMeds] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const [currentMedId, setCurrentMedId] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const { data: medications } = useMedications();
  const completeAppointment = useCompleteAppointment();

  const addMedication = () => {
    if (!currentMedId || currentQuantity < 1) return;
    const med = medications?.find((m) => m.id === currentMedId);
    if (!med) return;
    setSelectedMeds([...selectedMeds, { id: med.id, name: med.name, quantity: currentQuantity }]);
    setCurrentMedId("");
    setCurrentQuantity(1);
  };

  const handleComplete = async () => {
    try {
      await completeAppointment.mutateAsync({
        appointmentId: appointment.id,
        medications: selectedMeds.map((m) => ({ medicationId: m.id, quantity: m.quantity })),
      });
      toast.success("Приём завершён, лекарства списаны");
      onClose();
    } catch (error) {
      toast.error("Ошибка при завершении приёма");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Завершение приёма</DialogTitle>
          <DialogDescription>
            Назначьте лекарства (при необходимости) и завершите приём.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Label>Лекарство</Label>
              <Select value={currentMedId} onValueChange={(value) => setCurrentMedId(value || "nullMedId")}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите лекарство" />
                </SelectTrigger>
                <SelectContent>
                  {medications?.map((med) => (
                    <SelectItem key={med.id} value={med.id}>
                      {med.name} (в наличии: {med.quantityInStock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-24">
              <Label>Кол-во</Label>
              <Input
                type="number"
                min={1}
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(Number(e.target.value))}
              />
            </div>
            <Button type="button" onClick={addMedication}>
              Добавить
            </Button>
          </div>
          {selectedMeds.length > 0 && (
            <div className="text-sm">
              <p className="font-medium">Назначено:</p>
              {selectedMeds.map((m, i) => (
                <p key={i}>
                  {m.name} – {m.quantity} шт.
                </p>
              ))}
            </div>
          )}
          <Button onClick={handleComplete} className="w-full">
            Завершить приём
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}