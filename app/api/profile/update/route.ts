import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { updateKeycloakUser } from '@/lib/auth/keycloak-admin';
import axios from 'axios';

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, phone } = body;

  try {
    // 1. Обновляем Keycloak
    await updateKeycloakUser(session.user.id, { firstName, lastName });

    // 2. Обновляем Profile Service (через внутренний URL)
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/owners/${session.user.id}`,
      {
        id: session.user.id,
        firstName,
        lastName,
        phone,
        tgChatId: body.tgChatId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Update failed' },
      { status: 500 }
    );
  }
}