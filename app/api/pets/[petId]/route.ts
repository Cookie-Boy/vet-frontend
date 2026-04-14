import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import axios from 'axios';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { petId } = await params;
  const body = await request.json();

  try {
    // Предполагается, что бэкенд ожидает PUT /api/profile/pets/{petId}
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/pets/${petId}`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Pet update error:', error);
    return NextResponse.json(
      { error: error.message || 'Update failed' },
      { status: error.response?.status || 500 }
    );
  }
}