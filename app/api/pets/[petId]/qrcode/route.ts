import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import axios from 'axios';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ petId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { petId } = await params;
  const { searchParams } = new URL(request.url);
  const width = searchParams.get('width') || '300';
  const height = searchParams.get('height') || '300';

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/pets/${petId}/qrcode`,
      {
        params: { width, height },
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        responseType: 'arraybuffer',
      }
    );

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': response.headers['content-type'] || 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error: any) {
    console.error('QR code fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch QR code' },
      { status: error.response?.status || 500 }
    );
  }
}