// components/pets/QRCodeDisplay.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface QRCodeDisplayProps {
  petId: string;
  qrCode: string;
}

export function QRCodeDisplay({ petId, qrCode }: QRCodeDisplayProps) {
  const { data: session } = useSession();
  const [qrImageUrl, setQrImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!session?.accessToken) return;

    // Генерируем URL с токеном авторизации
    const url = `/api/profile/pets/${petId}/qrcode?width=300&height=300`;
    
    // Создаем объект URL с токеном в query параметре (если бэкенд поддерживает)
    // или используем headers через fetch
    const fetchQRCode = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load QR code: ${response.status}`);
        }
        
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setQrImageUrl(imageUrl);
      } catch (err) {
        console.error("Error loading QR code:", err);
        setError("Не удалось загрузить QR-код");
      }
    };

    fetchQRCode();

    // Cleanup
    return () => {
      if (qrImageUrl) {
        URL.revokeObjectURL(qrImageUrl);
      }
    };
  }, [petId, session]);

  const downloadQR = async () => {
    if (!session?.accessToken) return;

    try {
      const response = await fetch(`/api/profile/pets/${petId}/qrcode?width=600&height=600`, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pet-${qrCode || petId}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code:", error);
      setError("Не удалось скачать QR-код");
    }
  };

  if (!qrCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR-код питомца</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">QR-код еще не сгенерирован</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR-код питомца</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR-код питомца</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          {qrImageUrl ? (
            <img 
              src={qrImageUrl} 
              alt="QR Code" 
              width={300} 
              height={300}
            />
          ) : (
            <div className="w-[300px] h-[300px] flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Загрузка QR-кода...</p>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Код: <code className="bg-gray-100 px-2 py-1 rounded">{qrCode}</code><br />
          При сканировании этого QR-кода будет доступна экстренная медицинская карта питомца.
        </p>
        <Button onClick={downloadQR} disabled={!qrImageUrl}>
          <Download className="mr-2 h-4 w-4" /> Скачать QR-код
        </Button>
      </CardContent>
    </Card>
  );
}