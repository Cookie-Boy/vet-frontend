// frontend/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getKeycloakAdminToken } from '@/lib/auth/keycloak-admin';
import axios from 'axios';

// Функция для получения user token (логин пользователя)
async function loginUser(email: string, password: string): Promise<string> {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: process.env.KEYCLOAK_CLIENT_ID!,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
    username: email,
    password: password,
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
    throw new Error('Failed to login user');
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  console.log('=== REGISTER API CALLED ===');
  
  try {
    const body = await request.json();
    console.log('Request body:', { ...body, password: '***' });
    
    const { email, password, firstName, lastName, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      console.log('Validation failed: missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Получаем admin token для создания пользователя
    console.log('Getting admin token...');
    const adminToken = await getKeycloakAdminToken();
    console.log('Admin token obtained');

    // 2. Создаем пользователя в Keycloak
    console.log('Creating user in Keycloak...');
    const keycloakUserData = {
      username: email,
      email: email,
      firstName: firstName,
      lastName: lastName,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    };

    const createUserResponse = await fetch(
      `${process.env.KEYCLOAK_BASE_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(keycloakUserData),
      }
    );

    console.log('Keycloak response status:', createUserResponse.status);
    
    if (!createUserResponse.ok) {
      const error = await createUserResponse.text();
      console.error('Keycloak user creation failed:', error);
      
      if (createUserResponse.status === 409) {
        return NextResponse.json(
          { error: 'Пользователь с таким email уже существует' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: `Keycloak error: ${error}` },
        { status: 400 }
      );
    }

    // 3. Получаем ID созданного пользователя
    const location = createUserResponse.headers.get('location');
    const userId = location?.split('/').pop();
    console.log('Created user ID:', userId);

    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to get user ID' },
        { status: 500 }
      );
    }

    // 4. Логиним пользователя чтобы получить его токен
    console.log('Logging in user to get token...');
    let userToken: string;
    try {
      userToken = await loginUser(email, password);
      console.log('User token obtained');
    } catch (error) {
      console.error('Failed to login user:', error);
      return NextResponse.json(
        { error: 'User created but login failed' },
        { status: 500 }
      );
    }

    // 5. Создаем Owner в Profile Service используя ТОКЕН ПОЛЬЗОВАТЕЛЯ
    console.log('Creating owner in Profile Service with user token...');
    const ownerData = {
      id: userId,
      firstName,
      lastName,
      phone: phone || '',
    };
    console.log('Owner data:', ownerData);

    try {
      const profileResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/owners`,
        ownerData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`, // Используем токен пользователя!
          },
        }
      );
      console.log('Profile service response:', profileResponse.status);
    } catch (error: any) {
      console.error('Profile service error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      
      // Если не удалось создать профиль, но пользователь в Keycloak уже есть
      // Можно либо удалить пользователя, либо оставить как есть
      console.warn('Owner profile not created, but user exists in Keycloak');
      
      // Опционально: удаляем пользователя из Keycloak при ошибке
    //   await deleteUser(userId, adminToken);
      
      return NextResponse.json(
        { error: 'Failed to create owner profile' },
        { status: 500 }
      );
    }

    console.log('=== REGISTRATION SUCCESSFUL ===');
    return NextResponse.json({ 
      success: true, 
      userId,
      message: 'Registration successful' 
    });
  } catch (error: any) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}