// components/doctors/DoctorForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/useDoctors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DoctorResponse, Specialization } from "@/types/doctor";
import { useState } from "react";

const doctorFormSchema = z.object({
  firstName: z.string().min(1, "Имя обязательно"),
  lastName: z.string().min(1, "Фамилия обязательна"),
  middleName: z.string().optional(),
  specialization: z.nativeEnum(Specialization),
  licenseNumber: z.string().min(1, "Номер лицензии обязателен"),
  phoneNumber: z.string().regex(/^\+?[0-9\s\-\(\)]{10,20}$/, "Некорректный телефон"),
  email: z.string().email("Некорректный email"),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Формат ГГГГ-ММ-ДД"),
  startWorkingDay: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Формат ЧЧ:ММ:СС"),
  endWorkingDay: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Формат ЧЧ:ММ:СС"),
  bio: z.string().optional(),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  initialData?: DoctorResponse;
}

export function DoctorForm({ initialData }: DoctorFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor(initialData?.id || "");

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      middleName: initialData?.middleName || "",
      specialization: initialData?.specialization || Specialization.THERAPIST,
      licenseNumber: initialData?.licenseNumber || "",
      phoneNumber: initialData?.phoneNumber || "",
      email: initialData?.email || "",
      hireDate: initialData?.hireDate || new Date().toISOString().split("T")[0],
      startWorkingDay: initialData?.startWorkingDay || "09:00:00",
      endWorkingDay: initialData?.endWorkingDay || "18:00:00",
      bio: initialData?.bio || "",
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;

  const onSubmit = async (values: DoctorFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateDoctor.mutateAsync(values);
        toast.success("Данные врача обновлены");
      } else {
        await createDoctor.mutateAsync(values);
        toast.success("Врач добавлен");
      }
      router.push("/doctors");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось сохранить данные");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lastName">Фамилия *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
            <div>
              <Label htmlFor="firstName">Имя *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="middleName">Отчество</Label>
              <Input id="middleName" {...register("middleName")} />
            </div>
            <div>
              <Label htmlFor="specialization">Специализация *</Label>
              <Select
                onValueChange={(val) => setValue("specialization", val as Specialization)}
                defaultValue={watch("specialization")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите специализацию" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Specialization).map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && <p className="text-sm text-destructive">{errors.specialization.message}</p>}
            </div>
            <div>
              <Label htmlFor="licenseNumber">Номер лицензии *</Label>
              <Input id="licenseNumber" {...register("licenseNumber")} />
              {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="phoneNumber">Телефон *</Label>
              <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+7 (999) 123-45-67" />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="hireDate">Дата найма *</Label>
              <Input id="hireDate" type="date" {...register("hireDate")} />
              {errors.hireDate && <p className="text-sm text-destructive">{errors.hireDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="startWorkingDay">Начало рабочего дня *</Label>
              <Input id="startWorkingDay" type="time" step="1" {...register("startWorkingDay")} />
              {errors.startWorkingDay && <p className="text-sm text-destructive">{errors.startWorkingDay.message}</p>}
            </div>
            <div>
              <Label htmlFor="endWorkingDay">Конец рабочего дня *</Label>
              <Input id="endWorkingDay" type="time" step="1" {...register("endWorkingDay")} />
              {errors.endWorkingDay && <p className="text-sm text-destructive">{errors.endWorkingDay.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Биография / О себе</Label>
            <Textarea id="bio" {...register("bio")} rows={4} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : (initialData ? "Обновить" : "Создать")}
        </Button>
      </div>
    </form>
  );
}