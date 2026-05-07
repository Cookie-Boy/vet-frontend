// components/dashboard/HealthAlerts.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, PawPrint } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Alert {
  petId: string;
  petName: string;
  reason: string;
  timestamp: string;
}

interface HealthAlertsProps {
  alerts: Alert[];
}

export function HealthAlerts({ alerts }: HealthAlertsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Аномалии здоровья
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground">Все питомцы в норме.</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((alert, i) => (
              <li key={i} className="flex items-start gap-2 bg-red-50 p-2 rounded">
                <PawPrint className="h-4 w-4 text-destructive mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{alert.petName}</p>
                  <p className="text-xs text-muted-foreground">{alert.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(alert.timestamp), "d MMM, HH:mm", { locale: ru })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}