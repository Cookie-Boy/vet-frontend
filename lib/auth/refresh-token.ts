// lib/auth/refresh-token.ts
import { signOut } from "next-auth/react";

// Новая функция: принимает refreshToken, возвращает новые токены
export async function refreshTokenPair(refreshToken: string) {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    refresh_token: refreshToken,
  });

  const response = await fetch(
    `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}

// Оригинальная функция для клиента (использует сессию NextAuth)
export async function refreshAccessToken() {
  const { getSession } = await import("next-auth/react");
  const session = await getSession();
  
  if (!session?.refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const newTokens = await refreshTokenPair(session.refreshToken);
    
    // Обновляем сессию на клиенте
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTokens),
    });

    return newTokens.accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await signOut({ redirect: true, callbackUrl: "/login" });
    throw error;
  }
}