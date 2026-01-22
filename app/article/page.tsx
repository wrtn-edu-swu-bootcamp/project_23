'use client'

import { useState, useEffect, useRef } from 'react'
import { Heart, ExternalLink, Search, X, Loader2, TrendingUp, RefreshCw } from 'lucide-react'
import { searchNaverNews, searchNewsAPI, parseRSSFeed, RSS_FEEDS, normalizeArticle } from '@/lib/api'

const trendingSearches = ['NFT Art', 'Digital Art', 'Contemporary', 'Photography', 'Street Art']

// Fallback 이미지들
const fallbackImages = [
  'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop',
]

export default function ArticlePage() {
  const [articles, setArticles] = useState<any[]>([])
  const [wishedArticles, setWishedArticles] = useState(new Set<string>())
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [displayedCount, setDisplayedCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingArticles, setIsLoadingArticles] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // 초기 로드: RSS 피드에서 기사 가져오기
  useEffect(() => {
    loadInitialArticles()
  }, [])

  // Load saved articles from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('article-saved')
    if (saved) {
      setWishedArticles(new Set(JSON.parse(saved)))
    }
  }, [])

  const loadInitialArticles = async () => {
    setIsLoadingArticles(true)
    try {
      // Mock 데이터로 시작 (RSS 피드는 CORS 문제로 서버측에서만 작동)
      const mockArticles = [
        {
          id: 'mock-1',
          title: 'The Future of Digital Art in 2024',
          excerpt: 'Exploring how NFTs and AI are reshaping the contemporary art landscape...',
          url: 'https://www.artnews.com/',
          publishedAt: new Date().toISOString(),
          source: 'Art News',
          image: fallbackImages[0],
          topic: 'Digital Art',
          featured: true,
        },
        {
          id: 'mock-2',
          title: 'Spotlight: Emerging Artists to Watch',
          excerpt: 'Meet the new generation of artists making waves in the art world...',
          url: 'https://www.artforum.com/',
          publishedAt: new Date().toISOString(),
          source: 'Artforum',
          image: fallbackImages[1],
          topic: 'Contemporary Art',
        },
        {
          id: 'mock-3',
          title: 'Gallery Guide: Top Shows This Month',
          excerpt: 'Your essential guide to must-see exhibitions happening now...',
          url: 'https://hyperallergic.com/',
          publishedAt: new Date().toISOString(),
          source: 'Hyperallergic',
          image: fallbackImages[2],
          topic: 'Exhibitions',
        },
        {
          id: 'mock-4',
          title: 'NFT Revolution in Art Market',
          excerpt: 'How blockchain technology is transforming the way we buy and sell art...',
          url: 'https://www.theartnewspaper.com/',
          publishedAt: new Date().toISOString(),
          source: 'The Art Newspaper',
          image: fallbackImages[0],
          topic: 'NFT',
        },
        {
          id: 'mock-5',
          title: 'Photography Trends You Need to Know',
          excerpt: 'Discover the latest innovations and techniques in contemporary photography...',
          url: 'https://www.artnews.com/',
          publishedAt: new Date().toISOString(),
          source: 'Art News',
          image: fallbackImages[1],
          topic: 'Photography',
        },
      ]

      setArticles(mockArticles)
    } catch (error) {
      console.error('Failed to load articles:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsLoadingArticles(true)
    try {
      // 네이버 API로 검색 (한국어)
      const naverResult = await searchNaverNews(searchQuery, 10)
      const naverArticles = (naverResult.items || [])
        .map((item: any) => normalizeArticle(item, 'naver'))
        .map((article: any, index: number) => ({
          ...article,
          image: article.image || fallbackImages[index % fallbackImages.length],
        }))

      // News API로 검색 (영어)
      const newsAPIResult = await searchNewsAPI(`art ${searchQuery}`, 10)
      const newsAPIArticles = (newsAPIResult.articles || [])
        .map((item: any) => normalizeArticle(item, 'newsapi'))

      // 결과 병합
      const searchResults = [...naverArticles, ...newsAPIArticles]
      setArticles(searchResults)
      setDisplayedCount(5)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoadingArticles(false)
    }
  }

  const toggleWish = (id: string) => {
    setWishedArticles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem('article-saved', JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const filteredArticles = articles.filter(article => {
    const matchesTab = activeTab === 'all' || wishedArticles.has(article.id)
    return matchesTab
  })

  const displayedArticles = filteredArticles.slice(0, displayedCount)
  const hasMore = displayedCount < filteredArticles.length

  const featuredArticle = activeTab === 'all' && !searchQuery ? filteredArticles.find(a => a.featured) : null
  const regularArticles = featuredArticle 
    ? displayedArticles.filter(a => !a.featured)
    : displayedArticles

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + 5, filteredArticles.length))
            setIsLoading(false)
          }, 800)
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, filteredArticles.length])

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(5)
  }, [activeTab])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">ARTICLE</h1>
          <button
            onClick={loadInitialArticles}
            disabled={isLoadingArticles}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh articles"
          >
            <RefreshCw size={18} className={isLoadingArticles ? 'animate-spin' : ''} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-deep-purple text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            All Articles
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-deep-purple text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <Heart size={16} />
              Saved
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search art news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            onFocus={() => setIsSearching(true)}
            className="w-full bg-gray-900 rounded-lg pl-10 pr-20 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deep-purple transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setIsSearching(false)
                  loadInitialArticles()
                }}
                className="p-1 text-gray-500 hover:text-white rounded"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isLoadingArticles}
              className="px-3 py-1 bg-deep-purple text-white rounded text-xs font-medium hover:bg-opacity-80 transition-all disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Trending Searches */}
        {isSearching && !searchQuery && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <TrendingUp size={14} />
              <span>Trending</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchQuery(term)
                    setIsSearching(false)
                  }}
                  className="px-3 py-1.5 bg-gray-800 rounded-full text-xs text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {isLoadingArticles ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-deep-purple mb-4" size={48} />
          <p className="text-gray-400">Loading articles...</p>
        </div>
      ) : (
        <div className="pb-6">
          {/* Search Results Info */}
          {searchQuery && (
            <div className="px-4 py-3 bg-gray-900/30 border-b border-gray-800">
              <p className="text-sm text-gray-400">
                Found <span className="text-white font-semibold">{filteredArticles.length}</span> results for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Featured Article - Hero Section */}
          {featuredArticle && (
            <div className="mb-6">
              <a
                href={featuredArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-[16/10] bg-gray-800"
              >
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-deep-purple rounded-full text-xs font-semibold mb-3">
                    FEATURED
                  </span>
                  <h2 className="text-2xl font-bold mb-2 line-clamp-2">{featuredArticle.title}</h2>
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{featuredArticle.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{featuredArticle.source}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWish(featuredArticle.id)
                        }}
                        className="p-2 bg-black/50 rounded-full active:scale-95 transition-all"
                      >
                        <Heart
                          size={18}
                          className={wishedArticles.has(featuredArticle.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                        />
                      </button>
                      <div className="p-2 bg-black/50 rounded-full">
                        <ExternalLink size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Regular Articles */}
          <div className="px-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {activeTab === 'favorites' ? 'Saved Articles' : searchQuery ? 'Search Results' : 'Latest Articles'}
              </h2>
              <span className="text-sm text-gray-500">
                {filteredArticles.length} total
              </span>
            </div>
            
            {regularArticles.map((article) => (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 bg-gray-900/50 rounded-xl p-3 hover:bg-gray-900/70 transition-all active:scale-[0.98] block"
              >
                {/* Thumbnail */}
                <div className="w-28 h-28 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImages[0]
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-2">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      {article.topic && <span className="text-xs text-deep-purple">{article.topic}</span>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          toggleWish(article.id)
                        }}
                        className="touch-manipulation p-1 active:scale-95 transition-all"
                      >
                        <Heart
                          size={16}
                          className={wishedArticles.has(article.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                        />
                      </button>
                      <div className="p-1">
                        <ExternalLink size={16} className="text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-deep-purple" size={32} />
              </div>
            )}

            {/* Infinite scroll trigger */}
            {hasMore && !isLoading && <div ref={observerRef} className="h-4" />}

            {/* Empty state */}
            {regularArticles.length === 0 && (
              <div className="text-center py-12">
                <Search className="mx-auto mb-3 text-gray-600" size={48} />
                <p className="text-gray-500">
                  {activeTab === 'favorites' 
                    ? 'No saved articles yet' 
                    : searchQuery 
                      ? 'No articles found for your search'
                      : 'No articles available'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      loadInitialArticles()
                    }}
                    className="mt-4 px-4 py-2 bg-deep-purple rounded-lg text-sm font-medium hover:bg-opacity-80 transition-all"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}

            {/* End of list */}
            {!hasMore && regularArticles.length > 0 && (
              <div className="text-center py-8 text-sm text-gray-500">
                You've reached the end
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
