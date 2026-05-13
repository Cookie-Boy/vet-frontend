// components/LoadingRedirect.tsx
"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface LoadingRedirectProps {
  to: string;
  delay?: number;
}

export default function LoadingRedirect({ to, delay = 1000 }: LoadingRedirectProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = to; // или router.push(to) если не нужна перезагрузка
    }, delay);

    return () => clearTimeout(timer);
  }, [to, delay]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Подготовка рабочего пространства...</p>
    </div>
  );
}