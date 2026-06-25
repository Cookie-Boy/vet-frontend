// components/pets/PetForm.tsx
"use client";

import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petFormSchema, PetFormValues } from "@/lib/validations/pet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useCreatePet, useUpdatePet } from "@/hooks/usePets";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PetResponse } from "@/types/pet";
import { VaccinationsField } from "./VaccinationsField";
import { StringArrayField } from "./StringArrayField";

interface PetFormProps {
  ownerId: string;
  initialData?: PetResponse;
}

export function PetForm({ ownerId, initialData }: PetFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createPet = useCreatePet();
  const updatePet = useUpdatePet(initialData?.id || "");

  const methods = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      ownerId,
      name: initialData?.name || "",
      species: (initialData?.species as "cat" | "dog") || "dog",
      age: initialData?.age || 0,
      breed: initialData?.breed || "",
      chipNumber: initialData?.chipNumber || "",
      medicalRecord: initialData?.medicalRecord || { 
        vaccinations: [], 
        allergies: [], 
        chronicDiseases: [] 
      },
      collar: initialData?.collar || { 
        active: false, 
        homeInfo: { 
          alerting: true, 
          radius: 100, 
          lat: 55.7558, 
          lon: 37.6173 
        } 
      },
    },
  });

  const breedLabels: Record<string, string> = {
    persian: "Персидская",
    siamese: "Сиамская",
    maine_coon: "Мейн-кун",
    british: "Британская",
    labrador: "Лабрадор",
    german_shepherd: "Немецкая овчарка",
    bulldog: "Бульдог",
    poodle: "Пудель",
  };

  const { register, formState: { errors }, watch, setValue, handleSubmit } = methods;
  const selectedSpecies = watch("species");

  const onSubmit: SubmitHandler<PetFormValues> = async (values) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updatePet.mutateAsync(values);
        toast.success("Питомец обновлен");
      } else {
        await createPet.mutateAsync(values);
        toast.success("Питомец добавлен");
      }
      router.push("/pets");
      router.refresh();
    } catch (error) {
      console.error("Failed to save pet:", error);
      toast.error("Не удалось сохранить питомца");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Основное</TabsTrigger>
            <TabsTrigger value="medical">Медкарта</TabsTrigger>
            <TabsTrigger value="collar">Ошейник</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Имя *</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="species">Вид *</Label>
                    <Select onValueChange={(val) => setValue("species", val as "cat" | "dog")} defaultValue={selectedSpecies}>
                      <SelectTrigger>
                        <SelectValue>
                          {selectedSpecies === "cat" ? "Кошка" : selectedSpecies === "dog" ? "Собака" : "Выберите вид"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cat">Кошка</SelectItem>
                        <SelectItem value="dog">Собака</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.species && <p className="text-sm text-destructive">{errors.species.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="breed">Порода *</Label>
                    <Select
                      onValueChange={(val) => { if (val) setValue("breed", val); }}
                      value={watch("breed")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите породу">
                          {watch("breed") ? breedLabels[watch("breed")] || watch("breed") : "Выберите породу"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedSpecies === "cat"
                          ? ["persian", "siamese", "maine_coon", "british"]
                          : ["labrador", "german_shepherd", "bulldog", "poodle"]
                        ).map((code) => (
                          <SelectItem key={code} value={code}>
                            {breedLabels[code]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.breed && <p className="text-sm text-destructive">{errors.breed.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="age">Возраст (лет) *</Label>
                    <Input id="age" type="number" {...register("age", { valueAsNumber: true })} />
                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="chipNumber">Номер чипа</Label>
                    <Input id="chipNumber" {...register("chipNumber")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-4">
            <VaccinationsField />
            <StringArrayField name="medicalRecord.allergies" title="Аллергии" placeholder="Например: пенициллин" />
            <StringArrayField name="medicalRecord.chronicDiseases" title="Хронические заболевания" placeholder="Например: диабет" />
          </TabsContent>

          <TabsContent value="collar" className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Настройки умного ошейника</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch checked={watch("collar.active")} onCheckedChange={(checked) => setValue("collar.active", checked)} />
                  <Label>Ошейник активен</Label>
                </div>
                {watch("collar.active") && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Switch checked={watch("collar.homeInfo.alerting")} onCheckedChange={(checked) => setValue("collar.homeInfo.alerting", checked)} />
                      <Label>Оповещения при выходе из зоны</Label>
                    </div>
                    <div>
                      <Label>Радиус безопасной зоны (м)</Label>
                      <Input type="number" {...register("collar.homeInfo.radius", { valueAsNumber: true })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Широта дома</Label>
                        <Input type="number" step="any" {...register("collar.homeInfo.lat", { valueAsNumber: true })} />
                      </div>
                      <div>
                        <Label>Долгота дома</Label>
                        <Input type="number" step="any" {...register("collar.homeInfo.lon", { valueAsNumber: true })} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Отмена</Button>
          <Button type="submit" disabled={isLoading}>{isLoading ? "Сохранение..." : (initialData ? "Обновить" : "Создать")}</Button>
        </div>
      </form>
    </FormProvider>
  );
}