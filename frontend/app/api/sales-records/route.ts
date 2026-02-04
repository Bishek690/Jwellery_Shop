import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const response = await fetch(`${BACKEND_URL}/api/sales-records?${queryString}`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching sales records:', error)
    return NextResponse.json(
      { message: 'Failed to fetch sales records' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/api/sales-records`, {
      method: 'POST',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error creating sales record:', error)
    return NextResponse.json(
      { message: 'Failed to create sales record' },
      { status: 500 }
    )
  }
}
