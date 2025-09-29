import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Mendapatkan session di API route
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No bearer token' },
        { status: 401 }
      );
    }

    // Menggunakan bearer token untuk memanggil API eksternal
    const bearerToken = session.accessToken;
    
    // Contoh: Forward request ke API eksternal dengan bearer token
    const externalApiResponse = await fetch('https://drive-backend.oganilirkab.go.id/api/a12', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!externalApiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from external API' },
        { status: externalApiResponse.status }
      );
    }

    const data = await externalApiResponse.json();
    
    return NextResponse.json({
      success: true,
      data,
      user: session.user?.name,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized - No bearer token' },
        { status: 401 }
      );
    }

    const bearerToken = session.accessToken;
    const body = await request.json();

    // Contoh: POST data ke API eksternal dengan bearer token
    const externalApiResponse = await fetch('https://your-backend-api.com/data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!externalApiResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to create data' },
        { status: externalApiResponse.status }
      );
    }

    const result = await externalApiResponse.json();
    
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}