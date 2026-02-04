import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/raw-metal-stocks/${params.id}/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error adjusting stock quantity:', error)
    return NextResponse.json(
      { message: 'Failed to adjust stock quantity' },
      { status: 500 }
    )
  }
}
