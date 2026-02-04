import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('timeRange') || '6months';
    const groupBy = searchParams.get('groupBy') || 'day';
    
    const response = await fetch(`${BACKEND_URL}/api/analytics/sales-trend?timeRange=${timeRange}&groupBy=${groupBy}`, {
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
    console.error('Sales trend API error:', error);
    return NextResponse.json(
      { data: [] },
      { status: 200 }
    );
  }
}
