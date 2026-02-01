import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '6months';
    const limit = searchParams.get('limit') || '5';
    
    const response = await fetch(`${BACKEND_URL}/api/analytics/top-products?timeRange=${timeRange}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('cookie') && { 
          Cookie: request.headers.get('cookie')! 
        }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Top products API error:', error);
    return NextResponse.json(
      { data: [] },
      { status: 200 }
    );
  }
}
