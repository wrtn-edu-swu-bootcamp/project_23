import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const rows = searchParams.get('rows') || '10'

  const apiKey = process.env.NEXT_PUBLIC_CULTURE_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Culture API key not configured' },
      { status: 500 }
    )
  }

  try {
    // 공공데이터포털 문화체육관광부 전시회 정보 API
    const response = await fetch(
      `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/area?serviceKey=${apiKey}&rows=${rows}&sortStdr=1`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Culture API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Culture API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exhibitions', items: [] },
      { status: 500 }
    )
  }
}
