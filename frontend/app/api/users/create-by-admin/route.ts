import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get the authorization token from cookies
    const token = request.cookies.get('token')?.value

    const response = await fetch(`${BACKEND_URL}/api/users/create-by-admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Cookie': `token=${token}` }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('API proxy error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
