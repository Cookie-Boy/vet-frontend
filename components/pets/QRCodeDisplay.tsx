// components/pets/QRCodeDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { petsApi } from "@/lib/api/pets";

interface QRCodeDisplayProps {
  petId: string;
  qrCode: string;
}

export function QRCodeDisplay({ petId, qrCode }: QRCodeDisplayProps) {
  const qrUrl = petsApi.getPetQrCodeUrl(petId);

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `pet-${qrCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR-код питомца</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <img src={qrUrl} alt="QR Code" width={300} height={300} />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Код: <code>{qrCode}</code><br />
          При сканировании этого QR-кода будет доступна экстренная медицинская карта питомца.
        </p>
        <Button onClick={downloadQR}>
          <Download className="mr-2 h-4 w-4" /> Скачать QR-код
        </Button>
      </CardContent>
    </Card>
  );
}