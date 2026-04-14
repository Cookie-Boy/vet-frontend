import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import axios from 'axios';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/pets`,
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
    console.error('Pet creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Creation failed' },
      { status: error.response?.status || 500 }
    );
  }
}