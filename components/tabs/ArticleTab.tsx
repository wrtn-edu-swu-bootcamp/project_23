'use client'

import { useState, useEffect } from 'react'
import { Search, Bookmark, ExternalLink, Sparkles } from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, Chip, SearchInput, EmptyState, LoadingSpinner } from '@/components/ui/CommonUI'

interface Article {
  id: string
  title: string
  summary: string
  thumbnail: string
  url: string
  source: string
  category: string
  date: string
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

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen pb-24">
      <Header title="ARTICLE">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search articles..."
          icon={<Search size={18} />}
        />

        <div className="flex gap-2 overflow-x-auto hide-scrollbar mt-4">
          {categories.map((cat) => (
            <Chip key={cat} active={selectedCategory === cat} onClick={() => setSelectedCategory(cat)}>
              {cat}
            </Chip>
          ))}
        </div>
      </Header>

      <div className="px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState icon={<Search size={48} />} message="검색 결과가 없습니다" />
        ) : (
          filteredArticles.map((article, index) => {
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
                      <span className="text-xs bg-deep-purple px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <h2 className="text-xl font-bold mt-2 line-clamp-2">{article.title}</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.source}</span>
                      <div className="flex gap-3">
                        <button onClick={() => toggleSave(article.id)}>
                          <Bookmark
                            size={18}
                            className={savedArticles.has(article.id) ? 'fill-deep-purple text-deep-purple' : ''}
                          />
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-deep-purple hover:underline flex items-center gap-1"
                        >
                          Read <ExternalLink size={14} />
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
                    className="w-24 h-24 flex-shrink-0 bg-gray-800 rounded-lg bg-cover bg-center"
                    style={{ backgroundImage: `url(${article.thumbnail})` }}
                  />
                  <div className="flex-1">
                    <span className="text-xs text-gray-500 mb-1 block">{article.category}</span>
                    <h3 className="font-bold text-sm mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{article.source}</span>
                      <div className="flex gap-3">
                        <button onClick={() => toggleSave(article.id)}>
                          <Bookmark
                            size={16}
                            className={savedArticles.has(article.id) ? 'fill-deep-purple text-deep-purple' : ''}
                          />
                        </button>
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-deep-purple hover:underline flex items-center gap-1"
                        >
                          Read <ExternalLink size={12} />
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
