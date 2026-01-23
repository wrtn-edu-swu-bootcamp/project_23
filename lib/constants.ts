/**
 * API Configuration and Constants
 * Centralized configuration for all external APIs
 */

// ==================== API Base URLs ====================
export const API_BASE_URLS = {
  NAVER: 'https://openapi.naver.com/v1/search',
  NEWS_API: 'https://newsapi.org/v2',
  PUBLIC_DATA: 'http://www.culture.go.kr/openapi/rest/publicperformancedisplays',
  ARTSY: 'https://api.artsy.net/api',
} as const

// ==================== API Endpoints ====================
export const API_ENDPOINTS = {
  // Internal API routes
  NAVER_NEWS: '/api/naver-news',
  RSS_FEED: '/api/rss-feed',
  CULTURE_EXHIBITIONS: '/api/culture-exhibitions',
  
  // External endpoints (for reference)
  ARTSY_TOKEN: '/tokens/xapp_token',
  ARTSY_ARTWORKS: '/artworks',
  ARTSY_ARTISTS: '/artists',
} as const

// ==================== RSS Feed Sources ====================
export const RSS_FEEDS = {
  artNews: 'https://www.artnews.com/feed/',
  artforum: 'https://www.artforum.com/feeds/news.rss',
  hyperallergic: 'https://hyperallergic.com/feed/',
  theArtNewspaper: 'https://www.theartnewspaper.com/rss',
  frieze: 'https://www.frieze.com/feed',
  artReview: 'https://artreview.com/feed/',
} as const

// ==================== Art News Sources (Curated) ====================
export const ART_NEWS_SOURCES = [
  {
    id: 'artnet',
    name: 'Artnet News',
    language: 'EN',
    url: 'https://news.artnet.com/feed',
    category: 'International',
    description: 'Global art market news and analysis',
  },
  {
    id: 'artnewspaper',
    name: 'The Art Newspaper',
    language: 'EN',
    url: 'https://www.theartnewspaper.com/rss',
    category: 'International',
    description: 'Art world news, reviews, and analysis',
  },
  {
    id: 'artnews',
    name: 'ARTnews',
    language: 'EN',
    url: 'https://www.artnews.com/feed/',
    category: 'International',
    description: 'Latest art news and reviews',
  },
  {
    id: 'hyperallergic',
    name: 'Hyperallergic',
    language: 'EN',
    url: 'https://hyperallergic.com/feed/',
    category: 'International',
    description: 'Sensitive to art & its discontents',
  },
  {
    id: 'artforum',
    name: 'Artforum',
    language: 'EN',
    url: 'https://www.artforum.com/feeds/news.rss',
    category: 'International',
    description: 'International art magazine',
  },
] as const

// ==================== Region Options ====================
export const REGIONS = [
  'All',
  'Seoul',
  'Gyeonggi',
  'Busan',
  'Incheon',
  'Daegu',
  'Gwangju',
  'Daejeon',
  'Ulsan',
  'Jeju',
] as const

// ==================== Article Categories ====================
export const ARTICLE_CATEGORIES = [
  'All',
  'Critique',
  'Interview',
  'News',
  'Review',
  'Opinion',
] as const

// ==================== Default Values ====================
export const DEFAULTS = {
  PAGE_SIZE: 10,
  SEARCH_DEBOUNCE_MS: 300,
  TRANSITION_DELAY_MS: 200,
  GRID_COLUMNS: 3 as const,
} as const

// ==================== Mock Data Flags ====================
export const USE_MOCK_DATA = {
  FOLIO: process.env.NODE_ENV === 'development',
  NOTE: process.env.NODE_ENV === 'development',
  PLANNER: process.env.NODE_ENV === 'development',
  ARTICLE: process.env.NODE_ENV === 'development',
} as const

// ==================== Feature Flags ====================
export const FEATURES = {
  ENABLE_AI_SUMMARY: !!process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  ENABLE_NAVER_NEWS: !!process.env.NAVER_CLIENT_ID && !!process.env.NAVER_CLIENT_SECRET,
  ENABLE_ARTSY_API: !!process.env.ARTSY_CLIENT_ID && !!process.env.ARTSY_CLIENT_SECRET,
  ENABLE_N8N_INTEGRATION: !!process.env.N8N_WEBHOOK_URL,
} as const

// ==================== Environment Variables ====================
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
  NEWS_API_KEY: process.env.NEXT_PUBLIC_NEWS_API_KEY,
  PUBLIC_DATA_API_KEY: process.env.PUBLIC_DATA_API_KEY,
  N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
  ARTSY_CLIENT_ID: process.env.ARTSY_CLIENT_ID,
  ARTSY_CLIENT_SECRET: process.env.ARTSY_CLIENT_SECRET,
} as const

// ==================== UI Constants ====================
export const UI = {
  MAX_WIDTH: '390px', // iPhone 14 width
  HEADER_HEIGHT: '73px',
  BOTTOM_NAV_HEIGHT: '64px',
  LOADING_SCREEN_DURATION: 300, // ms
} as const

// ==================== Date Formats ====================
export const DATE_FORMATS = {
  DISPLAY_SHORT: 'MMM d, yyyy',
  DISPLAY_LONG: 'MMMM d, yyyy',
  STORAGE: 'yyyy-MM-dd',
  MONTH_YEAR: 'yyyy-MM',
} as const

// ==================== Error Messages ====================
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  API_ERROR: 'API 요청 중 오류가 발생했습니다.',
  STORAGE_ERROR: '저장 중 오류가 발생했습니다.',
  LOAD_ERROR: '데이터를 불러오는 중 오류가 발생했습니다.',
  INVALID_DATA: '잘못된 데이터 형식입니다.',
} as const

// ==================== Success Messages ====================
export const SUCCESS_MESSAGES = {
  SAVED: '저장되었습니다.',
  DELETED: '삭제되었습니다.',
  UPDATED: '업데이트되었습니다.',
  BOOKMARKED: '북마크에 추가되었습니다.',
  UNBOOKMARKED: '북마크에서 제거되었습니다.',
} as const
