// hooks/useAuthGuard.ts
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard(redirectTo = "/login") {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.replace(redirectTo);
    } else {
      setIsReady(true);
    }
  }, [session, status, router, redirectTo]);

  return { isReady, session };
}