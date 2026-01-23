import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import { ART_NEWS_SOURCES } from '@/lib/constants'

const parser = new Parser()

// RSS 피드 가져오기 + 검색
export async function POST(request: Request) {
  try {
    const { action, sourceId, query } = await request.json()

    // n8n이 설정되어 있으면 n8n 사용
    const n8nUrl = process.env.N8N_WEBHOOK_URL
    if (n8nUrl) {
      try {
        console.log('Using n8n workflow...')
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

        if (response.ok) {
          const data = await response.json()
          return NextResponse.json(data)
        } else {
          console.warn('n8n request failed, falling back to direct parsing')
        }
      } catch (error) {
        console.warn('n8n error, falling back to direct parsing:', error)
      }
    }

    // Fallback: 직접 RSS 파싱
    console.log('Using direct RSS parsing...')

    if (action === 'fetch_feed') {
      // 특정 소스의 피드 가져오기
      const source = ART_NEWS_SOURCES.find(s => s.id === sourceId)
      if (!source) {
        return NextResponse.json(
          { error: 'Source not found' },
          { status: 404 }
        )
      }

      const feed = await parser.parseURL(source.url)
      
      const articles = feed.items.slice(0, 20).map((item, index) => ({
        id: item.guid || item.link || `${sourceId}-${index}`,
        title: item.title || 'Untitled',
        summary: item.contentSnippet || item.content?.substring(0, 200) || '',
        thumbnail: item.enclosure?.url || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
        url: item.link || '#',
        source: source.name,
        sourceId: source.id,
        category: 'News',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        language: source.language,
      }))

      return NextResponse.json({
        articles,
        success: true,
        source: source.name,
        count: articles.length,
      })
    }

    if (action === 'search') {
      // 검색 기능 (간단 버전 - 키워드 매칭)
      const sources = sourceId
        ? ART_NEWS_SOURCES.filter(s => s.id === sourceId)
        : ART_NEWS_SOURCES

      const allArticles: any[] = []

      for (const source of sources) {
        try {
          const feed = await parser.parseURL(source.url)
          const articles = feed.items.slice(0, 10).map((item, index) => ({
            id: item.guid || item.link || `${source.id}-${index}`,
            title: item.title || 'Untitled',
            summary: item.contentSnippet || item.content?.substring(0, 200) || '',
            thumbnail: item.enclosure?.url || 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
            url: item.link || '#',
            source: source.name,
            sourceId: source.id,
            category: 'News',
            date: item.pubDate || item.isoDate || new Date().toISOString(),
            language: source.language,
          }))

          allArticles.push(...articles)
        } catch (error) {
          console.error(`Failed to parse ${source.name}:`, error)
        }
      }

      // 키워드 검색 (제목 + 요약)
      const searchLower = query.toLowerCase()
      const filtered = allArticles.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.summary.toLowerCase().includes(searchLower)
      )

      return NextResponse.json({
        articles: filtered.slice(0, 20),
        success: true,
        query,
        count: filtered.length,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
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
