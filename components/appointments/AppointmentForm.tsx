// components/appointments/AppointmentForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
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
import { useDoctors } from "@/hooks/useDoctors";
import { fromZonedTime } from 'date-fns-tz';

const appointmentSchema = z.object({
  petId: z.string().min(1, "Выберите питомца"),
  doctorId: z.string().nullable(),
  date: z.date(),
  timeSlot: z.string().min(1, "Выберите время"),
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
  
  const { data: doctors } = useDoctors();
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

  // Отслеживаем выбранные значения для отображения имён
  const selectedPetId = form.watch("petId");
  const selectedDoctorId = form.watch("doctorId");
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const selectedDoctor = doctors?.find(d => d.id === selectedDoctorId);

  const doctorIdForSlots = selectedDoctorId === "any" ? null : selectedDoctorId;
  const date = form.watch("date");
  const { data: correctSlots, isLoading: slotsLoading } = useAvailableSlots(
    doctorIdForSlots,
    date ? format(date, "yyyy-MM-dd") : ""
  );

  const onSubmit = async (values: AppointmentFormValues) => {
    console.log("Form values:", values);

    if (!values.timeSlot) {
      toast.error("Выберите время приёма");
      return;
    }

    const [startTime, endTime] = values.timeSlot.split("|");
    const selectedPetObj = pets.find(p => p.id === values.petId);

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const dateStr = format(values.date, "yyyy-MM-dd");
    const startLocalStr = `${dateStr} ${startTime}`;  // "2026-05-20 14:00"
    const endLocalStr = `${dateStr} ${endTime}`;

    console.log("Local Time: " + startLocalStr)

    const startUTC = fromZonedTime(startLocalStr, userTimezone);
    const endUTC = fromZonedTime(endLocalStr, userTimezone);

    console.log("UTC Time: " + startUTC)

    const appointmentData = {
      doctorId: values.doctorId, // теперь не преобразуем в null, так как null уже может быть
      ownerId: ownerId,
      petId: values.petId,
      startTime: startUTC,
      endTime: endUTC,
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
              {/* Отображаем имя питомца вместо ID */}
              {selectedPet ? selectedPet.name : "Выберите питомца"}
            </SelectTrigger>
            <SelectContent>
              {pets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name} ({pet.species}, {pet.breed})
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
          <CardTitle>Выберите врача</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedDoctorId || "any"}
            onValueChange={(val) => form.setValue("doctorId", val === "any" ? null : val)}
          >
            <SelectTrigger>
              {/* Отображаем ФИО врача или "Любой врач" */}
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
                  {doc.lastName} {doc.firstName} – {doc.specialization}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                  disabled={(d) => d < new Date() || d.getDay() === 0 || d.getDay() === 6}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {date && (
            <div>
              <Label>Доступное время</Label>
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
              {form.formState.errors.timeSlot && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.timeSlot.message}</p>
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