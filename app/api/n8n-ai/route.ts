import { NextResponse } from 'next/server'

// n8n webhook URL - 환경변수에서 가져오기
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || ''

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (!N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: 'N8N_WEBHOOK_URL not configured' },
        { status: 500 }
      )
    }

    // n8n webhook 호출
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        data,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n webhook failed: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('n8n API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}
