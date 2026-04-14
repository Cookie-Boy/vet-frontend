// components/pets/VaccinationsField.tsx
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { PetFormValues } from "@/lib/validations/pet";

export function VaccinationsField() {
  const { control, register } = useFormContext<PetFormValues>();
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicalRecord.vaccinations" as any, // bypass type checking
  });

  return (
    <Card>
      <CardHeader><CardTitle>Вакцинации</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-4 gap-2 items-end">
            <div>
              <Label>Название</Label>
              <Input {...register(`medicalRecord.vaccinations.${index}.name` as const)} />
            </div>
            <div>
              <Label>Дата</Label>
              <Input type="date" {...register(`medicalRecord.vaccinations.${index}.date` as const)} />
            </div>
            <div>
              <Label>След. дата</Label>
              <Input type="date" {...register(`medicalRecord.vaccinations.${index}.nextDueDate` as const)} />
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ name: "", date: "", nextDueDate: "" })}>
          <Plus className="mr-2 h-4 w-4" /> Добавить вакцинацию
        </Button>
      </CardContent>
    </Card>
  );
}