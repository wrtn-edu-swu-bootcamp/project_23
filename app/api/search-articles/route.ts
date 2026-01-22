import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

// RSS 피드에서 기사 가져오기 (간단한 예시)
const RSS_FEEDS = [
  'https://www.artnews.com/feed/',
  'https://hyperallergic.com/feed/',
]

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY not configured' },
        { status: 500 }
      )
    }

    // OpenAI를 사용하여 검색 키워드 추출
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Extract 3-5 relevant English keywords for searching art articles. Return only comma-separated keywords, no explanation.'
        },
        {
          role: 'user',
          content: query
        }
      ],
      temperature: 0.5,
      max_tokens: 100,
    })

    const keywords = completion.choices[0]?.message?.content || ''

    // 실제로는 여기서 RSS 피드나 뉴스 API를 검색해야 하지만
    // 데모를 위해 AI가 생성한 관련 기사 추천
    const articleSuggestions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are an art news curator. Based on the search query, suggest 3 relevant art articles with realistic titles and summaries. Return as JSON array with fields: title, summary, category (one of: Critique, Interview, News), source (art publication name).`
        },
        {
          role: 'user',
          content: `Search query: ${query}\nKeywords: ${keywords}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: 'json_object' }
    })

    const suggestionsText = articleSuggestions.choices[0]?.message?.content || '{}'
    let suggestions
    
    try {
      suggestions = JSON.parse(suggestionsText)
    } catch (e) {
      suggestions = { articles: [] }
    }

    // 기사 데이터 포맷팅
    const articles = (suggestions.articles || []).map((article: any, index: number) => ({
      id: `ai-${Date.now()}-${index}`,
      title: article.title || 'Untitled',
      summary: article.summary || '',
      thumbnail: `https://images.unsplash.com/photo-${1547891654 + index}-e66ed7ebb968?w=600`,
      url: '#',
      source: article.source || 'AI Recommended',
      category: article.category || 'News',
      date: new Date().toISOString().split('T')[0],
    }))

    return NextResponse.json({
      articles,
      keywords,
      success: true,
    })
  } catch (error: any) {
    console.error('Search Error:', error)
    return NextResponse.json(
      { 
        error: 'Search failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
