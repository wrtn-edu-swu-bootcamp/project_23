'use client'

import { useState, useRef } from 'react'
import { X, Image as ImageIcon, Type } from 'lucide-react'

type ContentBlock = {
  id: string
  type: 'text' | 'image'
  content: string
  imageFile?: File
}

export default function NoteNewPage() {
  const [title, setTitle] = useState('')
  const [blocks, setBlocks] = useState<ContentBlock[]>([
    { id: '1', type: 'text', content: '' }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTextBlock = () => {
    setBlocks(prev => [...prev, {
      id: Date.now().toString(),
      type: 'text',
      content: ''
    }])
  }

  const addImageBlock = () => {
    fileInputRef.current?.click()
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setBlocks(prev => [...prev, {
        id: Date.now().toString(),
        type: 'image',
        content: imageUrl,
        imageFile: file
      }])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev => prev.map(block =>
      block.id === id ? { ...block, content } : block
    ))
  }

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id))
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Please enter a title')
      return
    }

    setIsSubmitting(true)
    
    // Get existing notes
    const existingNotes = JSON.parse(localStorage.getItem('notes') || '[]')
    
    // Combine all text blocks into content
    const textContent = blocks
      .filter(block => block.type === 'text')
      .map(block => block.content)
      .join('\n\n')
    
    // Create new note
    const newNote = {
      id: Date.now(),
      title: title,
      content: textContent || 'No content',
      date: new Date().toISOString().split('T')[0],
      liked: false,
    }
    
    // Add to existing notes
    const updatedNotes = [newNote, ...existingNotes]
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Note saved successfully!')
    window.location.href = '/note'
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          <h1 className="text-xl font-bold">New Note</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim()}
            className="text-deep-purple font-semibold disabled:text-gray-600"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <div className="px-4 py-6 space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none placeholder:text-gray-700"
          maxLength={100}
        />

        {/* Content Blocks */}
        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="relative group">
              {block.type === 'text' ? (
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, e.target.value)}
                  placeholder="Write something..."
                  className="w-full bg-transparent border-none focus:outline-none resize-none min-h-[100px] placeholder:text-gray-700"
                />
              ) : (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={block.content}
                    alt="Content"
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Content Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={addTextBlock}
            className="flex-1 py-3 bg-gray-900 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <Type size={20} />
          </button>
          <button
            onClick={addImageBlock}
            className="flex-1 py-3 bg-gray-900 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <ImageIcon size={20} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </div>
    </div>
  )
}
