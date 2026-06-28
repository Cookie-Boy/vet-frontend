// components/appointments/AppointmentForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PetResponse } from "@/types/pet";
import { useAvailableSlots, useCreateAppointment } from "@/hooks/useAppointments";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UUID } from "crypto";
import { useClinics } from "@/hooks/useClinics";
import { useDoctorsByClinic } from "@/hooks/useDoctors";
import { fromZonedTime } from 'date-fns-tz';
import { getSpecializationLabel } from "@/types/doctor";

// Русские названия пород и видов
const breedLabels: Record<string, string> = {
  persian: "Персидская", siamese: "Сиамская", maine_coon: "Мейн-кун",
  british: "Британская", labrador: "Лабрадор", german_shepherd: "Немецкая овчарка",
  bulldog: "Бульдог", poodle: "Пудель",
};

const speciesLabels: Record<string, string> = {
  cat: "Кошка",
  dog: "Собака",
};

const appointmentSchema = z.object({
  petId: z.string().min(1, "Выберите питомца"),
  doctorId: z.string().nullable(),
  date: z.date(),
  timeSlot: z.string().optional(),
  comment: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  ownerId: string;
  pets: PetResponse[];
  preselectedDoctorId?: string;
}

export function AppointmentForm({ ownerId, pets, preselectedDoctorId }: AppointmentFormProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedClinicId, setSelectedClinicId] = useState<string | undefined>(undefined);

  const { data: clinics } = useClinics();
  const clinicId = selectedClinicId ? selectedClinicId : null;
  const { data: doctors } = useDoctorsByClinic(
    clinicId,
    { enabled: !!clinicId }
  );
  const createAppointment = useCreateAppointment();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      petId: "",
      doctorId: preselectedDoctorId || null,
      date: new Date(),
      timeSlot: "",
      comment: "",
    },
  });

  const selectedPetId = form.watch("petId");
  const selectedDoctorId = form.watch("doctorId");
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const selectedDoctor = doctors?.find(d => d.id === selectedDoctorId);

  const selectedClinic = clinics?.find(c => c.id === selectedClinicId);

  const doctorIdForSlots = selectedDoctorId === "any" ? null : selectedDoctorId;
  const date = form.watch("date");
  const { data: correctSlots, isLoading: slotsLoading } = useAvailableSlots(
    doctorIdForSlots,
    date ? format(date, "yyyy-MM-dd") : ""
  );

  const onSubmit = async (values: AppointmentFormValues) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let startUTC = null;
    let endUTC = null;

    if (values.timeSlot) {
      const [startTime, endTime] = values.timeSlot.split("|");
      const dateStr = format(values.date, "yyyy-MM-dd");
      const startLocalStr = `${dateStr} ${startTime}`;
      const endLocalStr = `${dateStr} ${endTime}`;
      startUTC = fromZonedTime(startLocalStr, userTimezone);
      endUTC = fromZonedTime(endLocalStr, userTimezone);
    }

    const selectedPetObj = pets.find(p => p.id === values.petId);

    const appointmentData = {
      doctorId: values.doctorId,
      ownerId: ownerId,
      petId: values.petId,
      startTime: startUTC,
      endTime: endUTC,
      clinicId: selectedClinicId || null,
      metadata: {
        comment: values.comment,
        petName: selectedPetObj?.name,
        originalTimezone: userTimezone,
      },
    };

    try {
      await createAppointment.mutateAsync(appointmentData as any);
      toast.success("Запись создана! Ожидайте подтверждения.");
      router.push("/appointments");
    } catch (error) {
      console.error("Appointment creation error:", error);
      toast.error("Не удалось создать запись. Попробуйте другое время.");
    }
  };

  const today = startOfDay(new Date());

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Выберите питомца</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            onValueChange={(val) => form.setValue("petId", val as UUID)}
            value={selectedPetId}
          >
            <SelectTrigger>
              {selectedPet
                ? `${selectedPet.name} (${speciesLabels[selectedPet.species] || selectedPet.species}, ${breedLabels[selectedPet.breed] || selectedPet.breed})`
                : "Выберите питомца"}
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name} ({speciesLabels[pet.species] || pet.species}, {breedLabels[pet.breed] || pet.breed})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.petId && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.petId.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Выберите клинику</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedClinicId || ""}
            onValueChange={(val) => {
              setSelectedClinicId(val || undefined);
              form.setValue("doctorId", null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите клинику">
                {selectedClinic ? selectedClinic.name : "Выберите клинику"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {clinics?.map((clinic) => (
                <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Выберите врача</CardTitle>
        </CardHeader>
        <CardContent>
          {!clinicId ? (
            <p className="text-sm text-muted-foreground">Сначала выберите клинику</p>
          ) : (
            <Select
              value={selectedDoctorId || "any"}
              onValueChange={(val) => form.setValue("doctorId", val === "any" ? null : val)}
            >
              <SelectTrigger>
                {selectedDoctorId === null
                  ? "Любой врач"
                  : selectedDoctor
                  ? `${selectedDoctor.lastName} ${selectedDoctor.firstName}`
                  : "Выберите врача"}
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Любой врач</SelectItem>
                {doctors?.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.lastName} {doc.firstName} – {getSpecializationLabel(doc.specialization)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дата и время</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Дата приёма</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "d MMMM yyyy", { locale: ru }) : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    form.setValue("date", d as Date);
                    form.setValue("timeSlot", "");
                    setSelectedDate(d);
                  }}
                  disabled={(d) => d < today || d.getDay() === 0 || d.getDay() === 6}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {date && (
            <div>
              <Label>Доступное время (необязательно)</Label>
              {slotsLoading ? (
                <p className="text-sm text-muted-foreground">Загрузка...</p>
              ) : correctSlots && correctSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {correctSlots.map((slot) => (
                    <Button
                      key={`${slot.startTime}|${slot.endTime}`}
                      type="button"
                      variant={form.watch("timeSlot") === `${slot.startTime}|${slot.endTime}` ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => form.setValue("timeSlot", `${slot.startTime}|${slot.endTime}`)}
                    >
                      {slot.startTime.substring(0, 5)}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Нет доступных слотов на выбранную дату</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дополнительно</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="comment">Комментарий (необязательно)</Label>
          <Textarea id="comment" {...form.register("comment")} rows={3} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={createAppointment.isPending}>
          {createAppointment.isPending ? "Создание..." : "Записаться"}
        </Button>
      </div>
    </form>
  );
}