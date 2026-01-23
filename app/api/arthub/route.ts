import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * 아트허브 콘텐츠 API
 * n8n 워크플로우와 연동하여 AI 분석된 콘텐츠 제공
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, limit = 10 } = body

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      )
    }

    // n8n 웹훅 URL (환경 변수에서 가져오기)
    const n8nWebhookUrl = process.env.N8N_ARTHUB_WEBHOOK_URL

    if (!n8nWebhookUrl) {
      console.warn('N8N_ARTHUB_WEBHOOK_URL is not configured')
      
      // n8n이 없으면 기본 응답 (더미 데이터)
      return NextResponse.json({
        success: false,
        source: 'arthub',
        category,
        categoryName: getCategoryName(category),
        items: [],
        stats: { total: 0, aiProcessed: 0 },
        message: 'n8n webhook not configured. Please set N8N_ARTHUB_WEBHOOK_URL in .env.local',
      })
    }

    // n8n 워크플로우 호출
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category,
        limit,
      }),
    })

    if (!response.ok) {
      console.error('n8n webhook failed:', response.statusText)
      return NextResponse.json(
        {
          success: false,
          source: 'arthub',
          category,
          items: [],
          stats: { total: 0, aiProcessed: 0 },
          error: 'Failed to fetch from n8n workflow',
        },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      ...data,
    })

  } catch (error) {
    console.error('ArthHub API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// 카테고리 이름 매핑
function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'archive-ongoing': '진행중인 전시',
    'archive-upcoming': '예정된 전시',
    'archive-ended': '종료된 전시',
    'curation': '큐레이션',
    'art-job': '아트 잡',
    'review': '리뷰',
  }
  
  return categoryMap[category] || category
}
