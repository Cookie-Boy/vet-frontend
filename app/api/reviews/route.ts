// app/api/reviews/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import { createServerApiClient } from '@/lib/api/server-client'; 

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { doctorId, authorName, rating, comment } = body;
    
    // Создаём клиент с сессией пользователя
    const client = await createServerApiClient();
    
    // Проксируем запрос к реальному management-service через gateway
    const response = await client.post(
      `/api/management/doctors/${doctorId}/reviews`,
      { doctorId, authorName, rating, comment }
    );
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Если нужен также GET по doctorId, добавьте GET handler
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const doctorId = searchParams.get('doctorId');
  if (!doctorId) {
    return NextResponse.json({ error: 'doctorId required' }, { status: 400 });
  }
  
  const client = await createServerApiClient();
  const response = await client.get(`/api/management/doctors/${doctorId}/reviews`);
  return NextResponse.json(response.data);
}