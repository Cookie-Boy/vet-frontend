// frontend/lib/auth/keycloak-admin.ts
interface AdminTokenResponse {
  access_token: string;
  expires_in: number;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getKeycloakAdminToken(): Promise<string> {
  console.log('Getting Keycloak admin token...');
  console.log('Using client:', process.env.KEYCLOAK_ADMIN_CLIENT_ID);
  
  // Используем кэш токена
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log('Using cached token');
    return cachedToken.token;
  }

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
    client_secret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET!,
  });

  const url = `${process.env.KEYCLOAK_BASE_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
  console.log('Token URL:', url);

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  console.log('Token response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get admin token:', error);
    throw new Error(`Failed to get admin token: ${error}`);
  }

  const data: AdminTokenResponse = await response.json();
  console.log('Admin token obtained successfully');
  
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // запас 60 сек
  };

  return data.access_token;
}

export async function updateKeycloakUser(
  userId: string,
  updates: { firstName?: string; lastName?: string; email?: string }
): Promise<void> {
  const adminToken = await getKeycloakAdminToken();

  const response = await fetch(
    `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users/${userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update Keycloak user: ${error}`);
  }
}