import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000';

export async function GET(request: NextRequest) {
  try {
    // Forward query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const backendUrl = `${BACKEND_URL}/api/products?${searchParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies from the request
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
    console.error('Products API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get cookies from the request
    const cookieHeader = request.headers.get('cookie');
    
    // Get form data from the request (for file uploads)
    const formData = await request.formData();
    
    console.log('Forwarding product creation to backend:', `${BACKEND_URL}/api/products`);
    
    // Forward the form data to the backend
    const response = await fetch(`${BACKEND_URL}/api/products`, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: formData,
    });

    const responseData = await response.json();
    console.log('Backend response:', response.status, responseData);

    if (!response.ok) {
      return NextResponse.json(responseData, { status: response.status });
    }

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Create product API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
