import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}`

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/sales-records/${params.id}`, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error fetching sales record:', error)
    return NextResponse.json(
      { message: 'Failed to fetch sales record' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/api/sales-records/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
      body: formData,
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error updating sales record:', error)
    return NextResponse.json(
      { message: 'Failed to update sales record' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/sales-records/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Error deleting sales record:', error)
    return NextResponse.json(
      { message: 'Failed to delete sales record' },
      { status: 500 }
    )
  }
}
