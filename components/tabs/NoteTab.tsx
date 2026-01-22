'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Plus, FileText } from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, FloatingButton, TabButton, SearchInput, EmptyState } from '@/components/ui/CommonUI'

interface Note {
  id: number
  title: string
  content: string
  date: string
  bookmarked: boolean
}

const mockNotes: Note[] = [
  { id: 1, title: 'Exhibition Review', content: 'Today I visited an amazing contemporary art exhibition at MMCA...', date: '2024-01-20', bookmarked: true },
  { id: 2, title: 'Artist Talk Notes', content: 'Key points from the artist talk about abstract expressionism and color theory...', date: '2024-01-18', bookmarked: false },
  { id: 3, title: 'Gallery Discovery', content: 'Found a new gallery in Samcheong-dong with emerging artists...', date: '2024-01-15', bookmarked: true },
]

export default function NoteTab() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeView, setActiveView] = useState<'all' | 'bookmarks'>('all')

  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    } else {
      setNotes(mockNotes)
      localStorage.setItem('notes', JSON.stringify(mockNotes))
    }
  }, [])

  const toggleBookmark = (id: number) => {
    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id ? { ...note, bookmarked: !note.bookmarked } : note
      )
      localStorage.setItem('notes', JSON.stringify(updated))
      return updated
    })
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesView = activeView === 'all' || note.bookmarked
    return matchesSearch && matchesView
  })

  return (
    <div className="min-h-screen pb-24">
      <Header title="NOTE">
        <div className="flex gap-2 mb-4">
          <TabButton active={activeView === 'all'} onClick={() => setActiveView('all')}>
            All Notes
          </TabButton>
          <TabButton active={activeView === 'bookmarks'} onClick={() => setActiveView('bookmarks')}>
            <span className="flex items-center gap-1">
              <Heart size={14} />
              Bookmarks
            </span>
          </TabButton>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search notes..."
          icon={<Search size={18} />}
        />
      </Header>

      <div className="px-4 py-6 space-y-4">
        {filteredNotes.length === 0 ? (
          <EmptyState
            icon={<FileText size={48} />}
            message={activeView === 'bookmarks' ? '북마크된 노트가 없습니다' : '노트를 작성해보세요'}
          />
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-bold flex-1 line-clamp-1">{note.title}</h2>
                <button
                  onClick={() => toggleBookmark(note.id)}
                  className="ml-2 touch-manipulation"
                >
                  <Heart
                    size={20}
                    className={note.bookmarked ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                  />
                </button>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{note.content}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>
                  {new Date(note.date).toLocaleDateString('ko-KR', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <button className="text-deep-purple hover:underline">더보기</button>
              </div>
            </Card>
          ))
        )}
      </div>

      <FloatingButton icon={<Plus size={24} />} />
    </div>
  )
}
