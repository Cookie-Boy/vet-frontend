// components/dashboard/InventoryStatus.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Pill } from "lucide-react";
import { MedicationResponse } from "@/types/medication";

interface InventoryStatusProps {
  medications: MedicationResponse[];
}

export function InventoryStatus({ medications }: InventoryStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Нужен заказ
        </CardTitle>
      </CardHeader>
      <CardContent>
        {medications.length === 0 ? (
          <p className="text-muted-foreground">Все запасы в норме.</p>
        ) : (
          <ul className="space-y-2">
            {medications.map((med) => (
              <li key={med.id} className="flex items-center justify-between border-b pb-1">
                <div className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{med.name}</span>
                </div>
                <span className="text-sm text-destructive">
                  {med.quantityInStock} / {med.minStockLevel}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}