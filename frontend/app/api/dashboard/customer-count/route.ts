import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`;

export async function GET(request: NextRequest) {
  try {
    // Forward the request to backend with cookies
    const response = await fetch(`${BACKEND_URL}/api/dashboard/customer-count`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward the cookie header from the original request
        'Cookie': request.headers.get('cookie') || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Customer count API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
