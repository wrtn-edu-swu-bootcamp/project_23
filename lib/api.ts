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
