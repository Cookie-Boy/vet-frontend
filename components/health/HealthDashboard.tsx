// components/health/HealthDashboard.tsx
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PetResponse } from "@/types/pet";
import { CollarStatus } from "@/components/health/CollarStatus";
import { VitalsChart } from "@/components/health/VitalsChart";
import { RecommendationsPanel } from "@/components/health/RecommendationsPanel";

interface HealthDashboardProps {
  pets: PetResponse[];
}

export function HealthDashboard({ pets }: HealthDashboardProps) {
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div className="space-y-6">
      <div className="max-w-xs">
        <Select value={selectedPetId} onValueChange={(value) => value && setSelectedPetId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите питомца" />
          </SelectTrigger>
          <SelectContent>
            {pets.map((pet) => (
              <SelectItem key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedPet && (
        <Tabs defaultValue="status" className="w-full">
          <TabsList>
            <TabsTrigger value="status">Текущий статус</TabsTrigger>
            <TabsTrigger value="history">История показателей</TabsTrigger>
            <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
          </TabsList>
          <TabsContent value="status" className="pt-4">
            <CollarStatus pet={selectedPet} />
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <VitalsChart petId={selectedPet.id} />
          </TabsContent>
          <TabsContent value="recommendations" className="pt-4">
            <RecommendationsPanel petId={selectedPet.id} />
          </TabsContent>
        </Tabs>
      )}

      {!selectedPet && (
        <p className="text-muted-foreground">У вас нет зарегистрированных питомцев.</p>
      )}
    </div>
  );
}