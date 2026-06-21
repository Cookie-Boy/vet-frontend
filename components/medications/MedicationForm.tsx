// components/medications/MedicationForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { medicationFormSchema, MedicationFormValues } from "@/lib/validations/medication";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateMedication, useUpdateMedication } from "@/hooks/useMedications";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MedicationResponse } from "@/types/medication";
import { useState } from "react";
import { useClinics } from "@/hooks/useClinics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MedicationFormProps {
  initialData?: MedicationResponse;
}

export function MedicationForm({ initialData }: MedicationFormProps) {
  const { data: clinics } = useClinics();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createMedication = useCreateMedication();
  const updateMedication = useUpdateMedication(initialData?.id || "");

  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      clinicId: initialData?.clinicId || "none",
      name: initialData?.name || "",
      description: initialData?.description || "",
      manufacturer: initialData?.manufacturer || "ВетПлатформа",
      batchNumber: initialData?.batchNumber || "",
      expiryDate: initialData?.expiryDate || "",
      quantityInStock: initialData?.quantityInStock || 0,
      minStockLevel: initialData?.minStockLevel || 10,
      reorderQuantity: initialData?.reorderQuantity || 100,
      pricePerUnit: initialData?.pricePerUnit || 0,
      isPrescriptionOnly: initialData?.isPrescriptionOnly || false,
    },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;

  const onSubmit = async (values: MedicationFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateMedication.mutateAsync(values);
        toast.success("Лекарство обновлено");
      } else {
        await createMedication.mutateAsync(values);
        toast.success("Лекарство добавлено");
      }
      router.push("/medications");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось сохранить лекарство");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Название *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div className="col-span-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea id="description" {...register("description")} rows={3} />
            </div>
            <div>
              <Label htmlFor="manufacturer">Производитель *</Label>
              <Input id="manufacturer" {...register("manufacturer")} />
              {errors.manufacturer && <p className="text-sm text-destructive">{errors.manufacturer.message}</p>}
            </div>
            <div>
              <Label htmlFor="clinicId">Клиника</Label>
              <Select
                onValueChange={(val) => setValue("clinicId", val === "none" || val == null ? undefined : val)}
                defaultValue={watch("clinicId") || "none"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите клинику" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Без клиники</SelectItem>
                  {clinics?.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="batchNumber">Номер партии *</Label>
              <Input id="batchNumber" {...register("batchNumber")} />
              {errors.batchNumber && <p className="text-sm text-destructive">{errors.batchNumber.message}</p>}
            </div>
            <div>
              <Label htmlFor="expiryDate">Срок годности *</Label>
              <Input id="expiryDate" type="date" {...register("expiryDate")} />
              {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
            </div>
            <div>
              <Label htmlFor="pricePerUnit">Цена за единицу (₽) *</Label>
              <Input id="pricePerUnit" type="number" step="0.01" {...register("pricePerUnit", { valueAsNumber: true })} />
              {errors.pricePerUnit && <p className="text-sm text-destructive">{errors.pricePerUnit.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Складские данные</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantityInStock">Текущее количество *</Label>
              <Input id="quantityInStock" type="number" {...register("quantityInStock", { valueAsNumber: true })} />
              {errors.quantityInStock && <p className="text-sm text-destructive">{errors.quantityInStock.message}</p>}
            </div>
            <div>
              <Label htmlFor="minStockLevel">Минимальный остаток *</Label>
              <Input id="minStockLevel" type="number" {...register("minStockLevel", { valueAsNumber: true })} />
              {errors.minStockLevel && <p className="text-sm text-destructive">{errors.minStockLevel.message}</p>}
            </div>
            <div>
              <Label htmlFor="reorderQuantity">Количество для автозаказа</Label>
              <Input id="reorderQuantity" type="number" {...register("reorderQuantity", { valueAsNumber: true })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Дополнительно</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={watch("isPrescriptionOnly")}
              onCheckedChange={(checked) => setValue("isPrescriptionOnly", checked)}
            />
            <Label>Только по рецепту</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Отмена
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Сохранение..." : (initialData ? "Обновить" : "Создать")}
        </Button>
      </div>
    </form>
  );
}