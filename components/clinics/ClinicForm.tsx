// components/clinics/ClinicForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateClinic, useUpdateClinic } from "@/hooks/useClinics";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClinicResponse } from "@/types/clinic";
import { useState } from "react";

const clinicSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  address: z.string().min(1, "Адрес обязателен"),
  phone: z.string().min(1, "Телефон обязателен"),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

interface ClinicFormProps {
  initialData?: ClinicResponse;
}

export function ClinicForm({ initialData }: ClinicFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createClinic = useCreateClinic();
  const updateClinic = useUpdateClinic(initialData?.id || "");

  const { register, handleSubmit, formState: { errors } } = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      phone: initialData?.phone || "",
    },
  });

  const onSubmit = async (values: ClinicFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateClinic.mutateAsync(values);
        toast.success("Клиника обновлена");
      } else {
        await createClinic.mutateAsync(values);
        toast.success("Клиника добавлена");
      }
      router.push("/clinics");
      router.refresh();
    } catch {
      toast.error("Не удалось сохранить");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6">
      <Card>
        <CardHeader><CardTitle>{initialData ? "Редактировать клинику" : "Новая клиника"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Название *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="address">Адрес *</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Телефон *</Label>
            <Input id="phone" {...register("phone")} placeholder="+7 (999) 123-45-67" />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? "Сохранение..." : (initialData ? "Обновить" : "Создать")}</Button>
      </div>
    </form>
  );
}