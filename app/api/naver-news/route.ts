import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query') || '미술 전시'
  const display = searchParams.get('display') || '10'

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Naver API credentials not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=${display}`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Naver API request failed')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Naver API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news', items: [] },
      { status: 500 }
    )
  }
}
