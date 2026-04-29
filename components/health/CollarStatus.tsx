// components/health/CollarStatus.tsx
"use client";

import { useLatestVitals } from "@/hooks/useHealthData";
import { PetResponse } from "@/types/pet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, Thermometer, MapPin, Wifi, WifiOff } from "lucide-react";
import { MapContainer, TileLayer, Circle, Marker, Popup } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

// Фикс иконок Leaflet в Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CollarStatusProps {
  pet: PetResponse;
}

export function CollarStatus({ pet }: CollarStatusProps) {
  const { data: vitals, isLoading } = useLatestVitals(pet.id);

  if (isLoading) {
    return <p className="text-muted-foreground">Загрузка данных с ошейника...</p>;
  }

  if (!vitals) {
    return <p className="text-muted-foreground">Нет данных с ошейника. Возможно, он не активен.</p>;
  }

  const isOnline = vitals.collarStatus === "online";
  const homeZone = pet.collar?.homeInfo;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Текущие показатели</CardTitle>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? <Wifi className="mr-1 h-3 w-3" /> : <WifiOff className="mr-1 h-3 w-3" />}
            {isOnline ? "Онлайн" : "Офлайн"}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Пульс</p>
                <p className="text-2xl font-bold">{vitals.heartRate} <span className="text-sm">уд/мин</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Дыхание</p>
                <p className="text-2xl font-bold">{vitals.respiratoryRate} <span className="text-sm">дых/мин</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Температура</p>
                <p className="text-2xl font-bold">{vitals.temperature.toFixed(1)}°C</p>
              </div>
            </div>
            {vitals.activityLevel !== undefined && (
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Активность</p>
                  <p className="text-2xl font-bold">{vitals.activityLevel}%</p>
                </div>
              </div>
            )}
          </div>
          {vitals.isAnomalous && (
            <p className="mt-3 text-sm text-destructive font-medium">
              ⚠️ Обнаружена аномалия: {vitals.anomalyReason || "Показатели вне нормы"}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Местоположение</CardTitle>
        </CardHeader>
        <CardContent>
          {vitals.location ? (
            <div className="h-[300px] rounded-lg overflow-hidden">
              <MapContainer
                center={[vitals.location.lat, vitals.location.lon]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[vitals.location.lat, vitals.location.lon]}>
                  <Popup>{pet.name} сейчас здесь</Popup>
                </Marker>
                {homeZone && (
                  <Circle
                    center={[homeZone.lat, homeZone.lon]}
                    radius={homeZone.radius}
                    pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.1 }}
                  >
                    <Popup>Безопасная зона (радиус {homeZone.radius} м)</Popup>
                  </Circle>
                )}
              </MapContainer>
            </div>
          ) : (
            <p className="text-muted-foreground">Нет данных о местоположении</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}