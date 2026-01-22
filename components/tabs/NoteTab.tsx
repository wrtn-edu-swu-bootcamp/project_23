'use client'

import { useState, useEffect } from 'react'
import { Search, Heart, Plus, FileText, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import { Card, FloatingButton, TabButton, SearchInput, EmptyState, Modal, Button } from '@/components/ui/CommonUI'
import NoteEditorModal, { NoteData } from '@/components/ui/NoteEditorModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Note {
  id: number
  title: string
  content: string
  date: string
  bookmarked: boolean
  images?: string[]
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
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; note: Note | null }>({
    isOpen: false,
    note: null,
  })

  useEffect(() => {
    const saved = localStorage.getItem('notes')
    if (saved) {
      setNotes(JSON.parse(saved))
    } else {
      setNotes(mockNotes)
      localStorage.setItem('notes', JSON.stringify(mockNotes))
    }
  }, [])

  const handleSaveNote = (data: NoteData) => {
    const now = new Date().toISOString().split('T')[0]
    
    if (selectedNote) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? {
              ...note,
              title: data.title,
              content: data.content,
              bookmarked: data.bookmarked,
              images: data.images.map(img => img.url),
            }
          : note
      )
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now(),
        title: data.title,
        content: data.content,
        date: now,
        bookmarked: data.bookmarked,
        images: data.images.map(img => img.url),
      }
      const updatedNotes = [newNote, ...notes]
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
    }

    setIsEditorOpen(false)
    setSelectedNote(null)
  }

  const toggleBookmark = (id: number) => {
    setNotes((prev) => {
      const updated = prev.map((note) =>
        note.id === id ? { ...note, bookmarked: !note.bookmarked } : note
      )
      localStorage.setItem('notes', JSON.stringify(updated))
      return updated
    })
  }

  const openEditor = (note?: Note) => {
    if (note) {
      setSelectedNote(note)
    } else {
      setSelectedNote(null)
    }
    setViewingNote(null)
    setIsEditorOpen(true)
  }

  const handleDeleteConfirm = (note: Note) => {
    setDeleteConfirm({ isOpen: true, note })
    setViewingNote(null)
  }

  const handleDelete = () => {
    if (deleteConfirm.note) {
      const updatedNotes = notes.filter(note => note.id !== deleteConfirm.note!.id)
      setNotes(updatedNotes)
      localStorage.setItem('notes', JSON.stringify(updatedNotes))
      setDeleteConfirm({ isOpen: false, note: null })
    }
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesView = activeView === 'all' || note.bookmarked
    return matchesSearch && matchesView
  })

  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
  }

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
            message={activeView === 'bookmarks' ? 'NO BOOKMARKED NOTES' : 'START WRITING YOUR NOTES'}
          />
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <div className="flex justify-between items-start mb-2">
                <h2 
                  className="text-lg font-bold flex-1 line-clamp-1 cursor-pointer hover:text-deep-purple"
                  onClick={() => setViewingNote(note)}
                >
                  {note.title}
                </h2>
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
              
              {/* Image preview if exists */}
              {note.images && note.images.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
                  {note.images.slice(0, 3).map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-800">
                      <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                  {note.images.length > 3 && (
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-800 flex items-center justify-center text-xs text-gray-400">
                      +{note.images.length - 3}
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{note.content}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span className="font-pixel">
                  {new Date(note.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteConfirm(note)
                    }}
                    className="text-white hover:text-gray-400 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditor(note)
                    }}
                    className="text-white hover:text-gray-400 p-1"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Note Detail Modal */}
      <Modal
        isOpen={!!viewingNote}
        onClose={() => setViewingNote(null)}
        title={viewingNote?.title}
      >
        {viewingNote && (
          <div className="space-y-4">
            {/* Images */}
            {viewingNote.images && viewingNote.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {viewingNote.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-800">
                    <Image src={img} alt="" fill className="object-cover" sizes="45vw" />
                  </div>
                ))}
              </div>
            )}

            {/* Content */}
            <div 
              className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(viewingNote.content) }}
            />

            {/* Date */}
            <p className="text-xs text-gray-500 font-pixel">
              {new Date(viewingNote.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button 
                variant="secondary" 
                onClick={() => handleDeleteConfirm(viewingNote)}
                className="flex-1 hover:bg-gray-800"
              >
                <Trash2 size={16} />
              </Button>
              <Button variant="secondary" onClick={() => setViewingNote(null)} className="flex-1">
                Close
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setViewingNote(null)
                  openEditor(viewingNote)
                }}
                className="flex-1"
              >
                <Edit2 size={16} />
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Editor Modal */}
      <NoteEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false)
          setSelectedNote(null)
        }}
        onSubmit={handleSaveNote}
        initialData={selectedNote ? {
          title: selectedNote.title,
          content: selectedNote.content,
          bookmarked: selectedNote.bookmarked,
          images: selectedNote.images?.map((url, idx) => ({
            id: `${selectedNote.id}-${idx}`,
            url,
            name: `image-${idx + 1}`,
          })) || [],
        } : undefined}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, note: null })}
        onConfirm={handleDelete}
        title="DELETE NOTE"
        message={`Delete "${deleteConfirm.note?.title}"? This action cannot be undone.`}
      />

      <FloatingButton 
        icon={<Plus size={24} />}
        onClick={() => openEditor()}
      />
    </div>
  )
}
