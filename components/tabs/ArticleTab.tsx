'use client'

import { useState, useEffect } from 'react'
import { Search, Bookmark, ExternalLink, Languages, Sparkles, Globe, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, SearchInput, EmptyState, LoadingSpinner } from '@/components/ui/CommonUI'
import { translateArticle, fetchRSSArticles, searchRSSArticles } from '@/lib/api'
import { ART_NEWS_SOURCES } from '@/lib/constants'

interface Article {
  id: string
  title: string
  summary: string
  thumbnail: string
  url: string
  source: string
  sourceId?: string
  category: string
  date: string
  language?: string
  translatedTitle?: string
  translatedSummary?: string
}

export default function ArticleTab() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [savedArticles, setSavedArticles] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [translatingId, setTranslatingId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Load saved bookmarks
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('article-bookmarks')
    if (savedBookmarks) {
      setSavedArticles(new Set(JSON.parse(savedBookmarks)))
    }
  }, [])

  // Load articles when source is selected
  useEffect(() => {
    if (selectedSource) {
      loadArticles(selectedSource)
    }
  }, [selectedSource])

  // Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      if (selectedSource) {
        loadArticles(selectedSource)
      }
      return
    }

    const timer = setTimeout(async () => {
      setIsSearching(true)
      try {
        const result = await searchRSSArticles(searchQuery, selectedSource || undefined)
        if (result && result.articles) {
          setArticles(result.articles)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [searchQuery, selectedSource])

  const loadArticles = async (sourceId: string) => {
    setIsLoading(true)
    try {
      const result = await fetchRSSArticles(sourceId)
      if (result && result.articles) {
        setArticles(result.articles)
      }
    } catch (error) {
      console.error('Load articles error:', error)
    } finally {
      setIsLoading(false)
    }
  }

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
    
    const article = articles.find(a => a.id === articleId)
    if (!article) return

    try {
      const result = await translateArticle(
        `Title: ${article.title}\n\nSummary: ${article.summary}`,
        'ko'
      )

      if (result && result.translation) {
        const lines = result.translation.split('\n\n')
        const translatedTitle = lines[0]?.replace('Title: ', '').replace('제목: ', '') || article.title
        const translatedSummary = lines[1]?.replace('Summary: ', '').replace('요약: ', '') || article.summary
        
        setArticles(prev => prev.map(a => 
          a.id === articleId 
            ? { 
                ...a, 
                translatedTitle,
                translatedSummary
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

  const currentSource = ART_NEWS_SOURCES.find(s => s.id === selectedSource)

  return (
    <div className="min-h-screen pb-24 flex">
      {/* Left Sidebar - Sources */}
      <div className={`
        fixed left-0 top-0 h-full w-48 bg-black border-r-4 border-white 
        transform transition-transform duration-300 z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-40
      `}>
        <div className="h-full overflow-y-auto pt-20 pb-24">
          <div className="px-2 py-3">
            <h3 className="text-xs font-pixel text-white mb-3 px-2 uppercase">Sources</h3>
            
            {/* All Sources */}
            <div>
              {ART_NEWS_SOURCES.map((source) => (
                <button
                  key={source.id}
                  onClick={() => {
                    setSelectedSource(source.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full text-left px-2 py-2 text-[10px] font-pixel
                    border-2 mb-1 transition-all uppercase
                    ${selectedSource === source.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black text-white border-white hover:bg-white hover:text-black'
                    }
                  `}
                >
                  {source.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Header title="ARTICLE">
          <div className="relative">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search with AI..."
              icon={<Search size={18} />}
            />
            {isSearching && (
              <div className="absolute right-12 top-1/2 -translate-y-1/2">
                <Sparkles size={16} className="animate-pulse text-white" />
              </div>
            )}
          </div>

          {/* Current Source Info */}
          {currentSource && (
            <div className="mt-3 text-xs font-pixel border-2 border-white bg-black px-3 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white">{currentSource.name}</span>
                  <span className="text-gray-500 ml-2">({currentSource.language})</span>
                </div>
                <Globe size={14} className="text-white" />
              </div>
            </div>
          )}
        </Header>

        {/* Articles List */}
        <div className="px-4 py-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : !selectedSource ? (
            <EmptyState 
              icon={<Globe size={48} />} 
              message="SELECT A SOURCE FROM THE RIGHT SIDEBAR"
            />
          ) : articles.length === 0 ? (
            <EmptyState 
              icon={<Search size={48} />} 
              message="NO ARTICLES FOUND"
            />
          ) : (
            articles.map((article) => {
              const isTranslated = !!(article.translatedTitle || article.translatedSummary)
              const displayTitle = article.translatedTitle || article.title
              const displaySummary = article.translatedSummary || article.summary

              return (
                <Card key={article.id}>
                  <div className="flex gap-4">
                    {article.thumbnail && (
                      <div
                        className="w-24 h-24 flex-shrink-0 bg-black border-2 border-white bg-cover bg-center"
                        style={{ backgroundImage: `url(${article.thumbnail})` }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-pixel text-xs line-clamp-2 uppercase flex-1">{displayTitle}</h3>
                        {isTranslated && (
                          <span className="text-[8px] text-white bg-black border border-white px-1 font-pixel flex-shrink-0">
                            🇰🇷
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-2 mb-2">{displaySummary}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-500">
                        <span className="font-pixel">{article.source}</span>
                        <div className="flex gap-2">
                          {article.language === 'EN' && (
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
                          )}
                          <button 
                            onClick={() => toggleSave(article.id)} 
                            className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
                          >
                            <Bookmark
                              size={14}
                              className={savedArticles.has(article.id) ? 'fill-white' : ''}
                            />
                          </button>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors flex items-center gap-1 font-pixel uppercase"
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

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed left-4 bottom-24 bg-white text-black border-4 border-black p-3 shadow-bitmap z-50"
      >
        <ChevronRight size={20} className={`transform transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
      </button>
    </div>
  )
}
