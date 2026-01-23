import { NextResponse } from 'next/server'

// RSS 피드 가져오기 + AI 검색
export async function POST(request: Request) {
  try {
    const { action, sourceId, query } = await request.json()

    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (!n8nUrl) {
      return NextResponse.json(
        { error: 'N8N_WEBHOOK_URL not configured' },
        { status: 500 }
      )
    }

    // n8n workflow 호출
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        sourceId,
        query,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`n8n request failed: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('RSS Feed API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch RSS feed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
