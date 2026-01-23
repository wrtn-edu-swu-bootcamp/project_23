import { NextResponse } from 'next/server'

const N8N_ARTICLE_WEBHOOK = process.env.N8N_ARTICLE_WEBHOOK_URL

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sourceId, limit = 20 } = body

    // If n8n is not configured, return error with helpful message
    if (!N8N_ARTICLE_WEBHOOK) {
      return NextResponse.json(
        { 
          error: 'N8N webhook URL not configured',
          message: 'Please set N8N_ARTICLE_WEBHOOK_URL in .env.local',
          helpUrl: '/docs/N8N-ARTICLE-WORKFLOW.md'
        },
        { status: 500 }
      )
    }

    // Call n8n webhook
    const response = await fetch(N8N_ARTICLE_WEBHOOK, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        sourceId, 
        limit,
        timestamp: new Date().toISOString()
      })
    })

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Article API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch articles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
