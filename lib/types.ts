// ==================== FOLIO Types ====================
export interface FolioItem {
  id: number
  type: 'image' | 'video'
  url: string
  date: string // YYYY-MM format
  title: string
  caption?: string
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

export type GridColumns = 2 | 3

// ==================== NOTE Types ====================
export interface Note {
  id: number
  title: string
  content: string
  date: string
  bookmarked: boolean
  tags?: string[]
  createdAt?: string
  updatedAt?: string
}

// ==================== PLANNER Types ====================
export interface Exhibition {
  id: number | string
  title: string
  location: string
  region: string
  startDate: string
  endDate: string
  poster: string
  url: string
  visited: boolean
  description?: string
  price?: string
  artist?: string
}

export type Region = 'All' | 'Seoul' | 'Gyeonggi' | 'Busan' | 'Incheon' | 'Jeju'

export type PlannerView = 'calendar' | 'wishlist'

// ==================== ARTICLE Types ====================
export interface Article {
  id: string
  title: string
  summary: string
  thumbnail: string
  url: string
  source: string
  category: ArticleCategory
  date: string
  content?: string
  author?: string
  readingTime?: number
}

export type ArticleCategory = 'All' | 'Critique' | 'Interview' | 'News'

// ==================== API Response Types ====================
export interface NaverNewsItem {
  title: string
  link: string
  description: string
  pubDate: string
  originallink?: string
}

export interface NaverNewsResponse {
  items: NaverNewsItem[]
  lastBuildDate?: string
  total?: number
  start?: number
  display?: number
}

export interface RSSFeedItem {
  title: string
  link: string
  description?: string
  contentSnippet?: string
  pubDate: string
  enclosure?: {
    url: string
    type?: string
  }
  source?: string
}

export interface RSSFeedResponse {
  items: RSSFeedItem[]
  title?: string
  description?: string
}

export interface CultureExhibitionItem {
  seq?: string
  mt20id?: string
  title?: string
  prfnm?: string
  place?: string
  fcltynm?: string
  area?: string
  startDate?: string
  prfpdfrom?: string
  endDate?: string
  prfpdto?: string
  poster?: string
  url?: string
}

// ==================== Common Types ====================
export interface BaseEntity {
  id: string | number
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ==================== Tab Types ====================
export type TabName = 'folio' | 'note' | 'planner' | 'article'

export interface Tab {
  name: string
  id: TabName
  icon: any // Lucide icon component
}

// ==================== Storage Keys ====================
export const STORAGE_KEYS = {
  FOLIO_ITEMS: 'folio-items',
  NOTES: 'notes',
  PLANNER_EXHIBITIONS: 'planner-exhibitions',
  PLANNER_WISHLIST: 'planner-wishlist',
  ARTICLES: 'articles',
  ARTICLE_BOOKMARKS: 'article-bookmarks',
} as const

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS]
