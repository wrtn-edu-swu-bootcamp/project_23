// API 설정 및 유틸리티 함수

// 1. 네이버 뉴스 검색 API
export async function searchNaverNews(query: string, display: number = 10) {
  try {
    // 서버 측에서만 호출 가능 (CORS 문제로 인해 API Route 필요)
    const response = await fetch(`/api/naver-news?query=${encodeURIComponent(query)}&display=${display}`)
    if (!response.ok) throw new Error('Naver API error')
    return await response.json()
  } catch (error) {
    console.error('Naver News API Error:', error)
    return { items: [] }
  }
}

// 2. News API (글로벌 뉴스)
export async function searchNewsAPI(query: string, pageSize: number = 10) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
    if (!apiKey) throw new Error('News API key not found')
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&language=en&apiKey=${apiKey}`
    )
    if (!response.ok) throw new Error('News API error')
    return await response.json()
  } catch (error) {
    console.error('News API Error:', error)
    return { articles: [] }
  }
}

// 3. 공공데이터포털 - 문화체육관광부 전시회 정보
export async function getCultureExhibitions(rows: number = 10) {
  try {
    const response = await fetch(`/api/culture-exhibitions?rows=${rows}`)
    if (!response.ok) throw new Error('Culture API error')
    return await response.json()
  } catch (error) {
    console.error('Culture API Error:', error)
    return { items: [] }
  }
}

// 4. RSS 피드 파싱 (무료 대안)
export async function parseRSSFeed(feedUrl: string) {
  try {
    const response = await fetch(`/api/rss-feed?url=${encodeURIComponent(feedUrl)}`)
    if (!response.ok) {
      console.warn(`Failed to fetch RSS feed: ${feedUrl}`)
      return { items: [] }
    }
    return await response.json()
  } catch (error) {
    console.warn('RSS Feed Error:', error)
    return { items: [] }
  }
}

// RSS 피드 목록
export const RSS_FEEDS = {
  artNews: 'https://www.artnews.com/feed/',
  artforum: 'https://www.artforum.com/feeds/news.rss',
  hyperallergic: 'https://hyperallergic.com/feed/',
  theArtNewspaper: 'https://www.theartnewspaper.com/rss',
}

// 기사 데이터 정규화
export function normalizeArticle(article: any, source: 'naver' | 'newsapi' | 'rss') {
  switch (source) {
    case 'naver':
      return {
        id: article.link,
        title: article.title.replace(/<[^>]*>/g, ''),
        excerpt: article.description.replace(/<[^>]*>/g, ''),
        url: article.link,
        publishedAt: article.pubDate,
        source: 'Naver News',
        image: null,
        topic: 'Art News',
      }
    case 'newsapi':
      return {
        id: article.url,
        title: article.title,
        excerpt: article.description || '',
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source.name,
        image: article.urlToImage,
        topic: 'Art News',
      }
    case 'rss':
      return {
        id: article.link,
        title: article.title,
        excerpt: article.contentSnippet || article.description || '',
        url: article.link,
        publishedAt: article.pubDate,
        source: article.source || 'RSS Feed',
        image: article.enclosure?.url || null,
        topic: 'Art News',
      }
    default:
      return article
  }
}

// 전시회 데이터 정규화
export function normalizeExhibition(exhibition: any, source: 'culture' | 'manual') {
  if (source === 'culture') {
    return {
      id: exhibition.seq || exhibition.mt20id,
      title: exhibition.title || exhibition.prfnm,
      location: exhibition.place || exhibition.fcltynm,
      region: exhibition.area || exhibition.area,
      startDate: exhibition.startDate || exhibition.prfpdfrom,
      endDate: exhibition.endDate || exhibition.prfpdto,
      poster: exhibition.poster || exhibition.poster,
      url: exhibition.url || `http://www.culture.go.kr/`,
    }
  }
  return exhibition
}

// 5. OpenAI 번역 API (직접 호출)
export async function translateArticle(text: string, targetLang: string = 'ko') {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, targetLang }),
    })
    
    if (!response.ok) {
      throw new Error('Translation request failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Translation Error:', error)
    return null
  }
}

// 6. AI 기사 검색 (OpenAI 기반)
export async function searchAIArticles(query: string) {
  try {
    const response = await fetch('/api/search-articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    
    if (!response.ok) {
      throw new Error('Search request failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Search Error:', error)
    return { articles: [] }
  }
}

// n8n AI Agent 호출 (선택적 - n8n 사용 시)
export async function callN8nAI(action: string, data: any) {
  try {
    const response = await fetch('/api/n8n-ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, data }),
    })
    
    if (!response.ok) {
      throw new Error('n8n AI request failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('n8n AI Error:', error)
    return null
  }
}

// 7. RSS 피드 기사 가져오기 (n8n 기반)
export async function fetchRSSArticles(sourceId: string) {
  try {
    const response = await fetch('/api/rss-articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'fetch_feed',
        sourceId,
      }),
    })
    
    if (!response.ok) {
      throw new Error('RSS fetch failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('RSS Fetch Error:', error)
    return { articles: [] }
  }
}

// 8. RSS 피드 검색 (n8n + AI)
export async function searchRSSArticles(query: string, sourceId?: string) {
  try {
    const response = await fetch('/api/rss-articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'search',
        query,
        sourceId, // optional: 특정 소스만 검색
      }),
    })
    
    if (!response.ok) {
      throw new Error('RSS search failed')
    }
    
    return await response.json()
  } catch (error) {
    console.error('RSS Search Error:', error)
    return { articles: [] }
  }
}