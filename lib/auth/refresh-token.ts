// frontend/lib/auth/refresh-token.ts
import { getSession, signOut } from "next-auth/react";

export async function refreshAccessToken() {
  const session = await getSession();
  
  if (!session?.refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
      refresh_token: session.refreshToken,
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
    
    // Обновляем токены в сессии NextAuth
    // Это нужно сделать через специальный эндпоинт NextAuth
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      }),
    });

    return data.access_token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    await signOut({ redirect: true, callbackUrl: "/login" });
    throw error;
  }
}