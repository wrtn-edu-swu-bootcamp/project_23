'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Plus, Edit3 } from 'lucide-react'
import Link from 'next/link'

// 임시 데이터
const initialMockNotes = [
  { id: 1, title: 'My First Exhibition', content: 'Today I visited an amazing contemporary art exhibition...', date: '2024-01-20', liked: true },
  { id: 2, title: 'Artist Talk Notes', content: 'Key points from the artist talk about abstract expressionism...', date: '2024-01-18', liked: false },
  { id: 3, title: 'Gallery Visit', content: 'Discovered a new gallery in the city...', date: '2024-01-15', liked: true },
]

export default function NotePage() {
  const [notes, setNotes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [likedNotes, setLikedNotes] = useState(new Set<number>())
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all')

  useEffect(() => {
    // Load from localStorage
    const savedNotes = localStorage.getItem('notes')
    const savedLikes = localStorage.getItem('liked-notes')
    
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    } else {
      setNotes(initialMockNotes)
      localStorage.setItem('notes', JSON.stringify(initialMockNotes))
    }
    
    if (savedLikes) {
      setLikedNotes(new Set(JSON.parse(savedLikes)))
    } else {
      setLikedNotes(new Set([1, 3]))
    }
  }, [])

  const toggleLike = (id: number) => {
    setLikedNotes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      // Save to localStorage
      localStorage.setItem('liked-notes', JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || likedNotes.has(note.id)
    return matchesSearch && matchesTab
  })

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">NOTE</h1>
        
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
            All Notes
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
              Favorites
            </span>
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deep-purple"
          />
        </div>
      </header>

      {/* Content - Magazine Style */}
      <div className="px-4 py-6 space-y-4">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-lg font-bold flex-1">{note.title}</h2>
              <button
                onClick={() => toggleLike(note.id)}
                className="ml-2 touch-manipulation"
              >
                <Heart
                  size={20}
                  className={likedNotes.has(note.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}
                />
              </button>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2 mb-3">{note.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              <Link href={`/note/${note.id}`} className="text-deep-purple hover:underline">
                Read more
              </Link>
            </div>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {activeTab === 'favorites' ? 'No favorite notes yet' : 'No notes found'}
          </div>
        )}
      </div>

      {/* Floating New Note Button */}
      <Link
        href="/note/new"
        className="fixed bottom-24 right-6 w-14 h-14 bg-deep-purple rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-80 transition-all active:scale-95 z-40"
      >
        <Plus size={24} />
      </Link>
    </div>
  )
}
