import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization token from cookies
    const token = request.cookies.get('token')?.value

    // Call backend logout endpoint
    const response = await fetch(`${BACKEND_URL}/api/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Cookie': `token=${token}` }),
      },
    })

    // Create response
    const nextResponse = NextResponse.json(
      { message: 'Logged out successfully', success: true },
      { status: 200 }
    )

    // Clear the token cookie
    nextResponse.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return nextResponse
  } catch (error) {
    console.error('Logout API proxy error:', error)
    
    // Even if backend call fails, clear the cookie locally
    const nextResponse = NextResponse.json(
      { message: 'Logged out successfully', success: true },
      { status: 200 }
    )

    nextResponse.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    })

    return nextResponse
  }
}
