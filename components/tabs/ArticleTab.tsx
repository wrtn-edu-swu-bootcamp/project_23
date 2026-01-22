'use client'

import { useState, useEffect } from 'react'
import { Search, Bookmark, ExternalLink, Languages, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, Chip, SearchInput, EmptyState, LoadingSpinner } from '@/components/ui/CommonUI'
import { translateArticle, searchAIArticles } from '@/lib/api'

interface Article {
  id: string
  title: string
  summary: string
  thumbnail: string
  url: string
  source: string
  category: string
  date: string
  translatedTitle?: string
  translatedSummary?: string
}

const categories = ['All', 'Critique', 'Interview', 'News']

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'The Future of Contemporary Art in Asia',
    summary: 'Exploring how Asian contemporary art is shaping global art discourse...',
    thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600',
    url: 'https://example.com',
    source: 'Art Forum',
    category: 'Critique',
    date: '2024-01-20',
  },
  {
    id: '2',
    title: 'Interview: Rising Star Artist Lee Min-jung',
    summary: 'An intimate conversation with one of Korea\'s most promising young artists...',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600',
    url: 'https://example.com',
    source: 'Art News',
    category: 'Interview',
    date: '2024-01-18',
  },
  {
    id: '3',
    title: 'Major Exhibition Opens at MMCA',
    summary: 'The National Museum of Modern and Contemporary Art unveils groundbreaking exhibition...',
    thumbnail: 'https://images.unsplash.com/photo-1577083552431-6e5fd01d3c3f?w=600',
    url: 'https://example.com',
    source: 'Korea Herald',
    category: 'News',
    date: '2024-01-15',
  },
]

export default function ArticleTab() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [translatingId, setTranslatingId] = useState<string | null>(null)
  const [aiSearchResults, setAiSearchResults] = useState<Article[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('articles')
    const savedBookmarks = localStorage.getItem('article-bookmarks')

    if (saved) {
      setArticles(JSON.parse(saved))
    } else {
      setArticles(mockArticles)
      localStorage.setItem('articles', JSON.stringify(mockArticles))
    }

    if (savedBookmarks) {
      setSavedArticles(new Set(JSON.parse(savedBookmarks)))
    }
  }, [])

  // AI 검색 (디바운스 적용)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setAiSearchResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const result = await searchAIArticles(searchQuery)
        if (result && result.articles) {
          setAiSearchResults(result.articles)
        }
      } catch (error) {
        console.error('AI search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const toggleSave = (id: string) => {
    setSavedArticles((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem('article-bookmarks', JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const handleTranslate = async (articleId: string) => {
    setTranslatingId(articleId)
    
    const article = allArticles.find(a => a.id === articleId)
    if (!article) return

    try {
      const result = await translateArticle(
        `Title: ${article.title}\n\nSummary: ${article.summary}`,
        'ko'
      )

      if (result && result.translation) {
        const [translatedTitle, translatedSummary] = result.translation.split('\n\n')
        
        setArticles(prev => prev.map(a => 
          a.id === articleId 
            ? { 
                ...a, 
                translatedTitle: translatedTitle.replace('Title: ', ''),
                translatedSummary: translatedSummary.replace('Summary: ', '')
              }
            : a
        ))
      }
    } catch (error) {
      console.error('Translation error:', error)
      alert('번역에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setTranslatingId(null)
    }
  }

  // AI 검색 결과와 기존 기사 합치기
  const allArticles = searchQuery && aiSearchResults.length > 0
    ? [...aiSearchResults, ...articles]
    : articles

  const filteredArticles = allArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.translatedTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.translatedSummary?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pb-24">
      <Header title="ARTICLE">
        <div className="relative">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Search articles with AI..."
            icon={<Search size={18} />}
          />
          {isSearching && (
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <Sparkles size={16} className="animate-pulse text-white" />
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-4">
          {categories.map((cat) => (
            <Chip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Chip>
          ))}
        </div>

        {/* AI 검색 상태 표시 */}
        {searchQuery && aiSearchResults.length > 0 && (
          <div className="mt-3 text-xs font-pixel text-white border-2 border-white bg-black px-3 py-2 flex items-center gap-2">
            <Sparkles size={14} />
            AI FOUND {aiSearchResults.length} RELATED ARTICLES
          </div>
        )}
      </Header>

      <div className="px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState icon={<Search size={48} />} message="NO SEARCH RESULTS" />
        ) : (
          filteredArticles.map((article, index) => {
            const isTranslated = !!(article.translatedTitle || article.translatedSummary)
            const displayTitle = article.translatedTitle || article.title
            const displaySummary = article.translatedSummary || article.summary

            // Hero card for first article
            if (index === 0) {
              return (
                <Card key={article.id} className="p-0 overflow-hidden">
                  <div
                    className="h-48 bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${article.thumbnail})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs bg-black border-2 border-white px-2 py-1 font-pixel uppercase">
                        {article.category}
                      </span>
                      <h2 className="text-xl font-bitmap mt-2 line-clamp-2">{displayTitle}</h2>
                      {isTranslated && (
                        <span className="text-[10px] text-white bg-black border border-white px-1 mt-1 inline-block font-pixel">
                          🇰🇷 TRANSLATED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{displaySummary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="font-pixel">{article.source}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTranslate(article.id)}
                          disabled={translatingId === article.id}
                          className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                          title="Translate to Korean"
                        >
                          {translatingId === article.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Languages size={16} />
                          )}
                        </button>
                        <button onClick={() => toggleSave(article.id)} className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors">
                          <Bookmark
                            size={16}
                            className={savedArticles.has(article.id) ? 'fill-white' : ''}
                          />
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors flex items-center gap-1 font-pixel text-[10px] uppercase"
                        >
                          READ <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            }

            // Regular cards
            return (
              <Card key={article.id}>
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 flex-shrink-0 bg-black border-2 border-white bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.thumbnail})` }}
                  />
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 mb-1 block font-pixel uppercase">{article.category}</span>
                    <h3 className="font-pixel text-xs mb-2 line-clamp-2 uppercase">{displayTitle}</h3>
                    {isTranslated && (
                      <span className="text-[8px] text-white bg-black border border-white px-1 mb-1 inline-block font-pixel">
                        🇰🇷
                      </span>
                    )}
                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{displaySummary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="text-[10px] font-pixel">{article.source}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTranslate(article.id)}
                          disabled={translatingId === article.id}
                          className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors disabled:opacity-50"
                          title="Translate"
                        >
                          {translatingId === article.id ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            <Languages size={14} />
                          )}
                        </button>
                        <button onClick={() => toggleSave(article.id)} className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors">
                          <Bookmark
                            size={14}
                            className={savedArticles.has(article.id) ? 'fill-white' : ''}
                          />
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors flex items-center gap-1 font-pixel text-[10px] uppercase"
                        >
                          READ <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
