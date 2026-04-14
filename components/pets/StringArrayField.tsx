// components/pets/StringArrayField.tsx
"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { PetFormValues } from "@/lib/validations/pet";

interface StringArrayFieldProps {
  name: "medicalRecord.allergies" | "medicalRecord.chronicDiseases";
  title: string;
  placeholder?: string;
}

export function StringArrayField({ name, title, placeholder }: StringArrayFieldProps) {
  const { watch, setValue } = useFormContext<PetFormValues>();
  
  // Получаем текущий массив
  const items = watch(name) || [];

  const addItem = () => {
    setValue(name, [...items, ""], { shouldValidate: true });
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setValue(name, newItems, { shouldValidate: true });
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setValue(name, newItems, { shouldValidate: true });
  };

  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input 
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" /> Добавить
        </Button>
      </CardContent>
    </Card>
  );
}