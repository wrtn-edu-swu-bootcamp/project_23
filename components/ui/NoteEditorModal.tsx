'use client'

import { useState, useEffect } from 'react'
import { Modal, Button } from './CommonUI'
import ImageUpload, { UploadedImage } from './ImageUpload'
import { Bold, Italic, List } from 'lucide-react'

interface NoteEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NoteData) => void
  initialData?: Partial<NoteData>
}

export interface NoteData {
  title: string
  content: string
  images: UploadedImage[]
  bookmarked: boolean
}

export default function NoteEditorModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  initialData 
}: NoteEditorModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [images, setImages] = useState<UploadedImage[]>([])
  const [bookmarked, setBookmarked] = useState(false)

  // Load initial data when editing
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Editing mode - load existing data
        setTitle(initialData.title || '')
        setContent(initialData.content || '')
        setImages(initialData.images || [])
        setBookmarked(initialData.bookmarked || false)
      } else {
        // New note mode - reset to empty
        setTitle('')
        setContent('')
        setImages([])
        setBookmarked(false)
      }
    }
  }, [isOpen, initialData])

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('ENTER A TITLE')
      return
    }

    if (!content.trim()) {
      alert('ENTER CONTENT')
      return
    }

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      images,
      bookmarked,
    })
  }

  const handleClose = () => {
    // Clean up blob URLs only for new uploads
    images.forEach(img => {
      if (img.url.startsWith('blob:') && !initialData?.images?.find(i => i.url === img.url)) {
        URL.revokeObjectURL(img.url)
      }
    })
    onClose()
  }

  const insertFormatting = (format: 'bold' | 'italic' | 'list') => {
    const textarea = document.getElementById('note-content') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = content
    let cursorPos = start

    switch (format) {
      case 'bold':
        if (selectedText) {
          newText = content.substring(0, start) + `**${selectedText}**` + content.substring(end)
          cursorPos = end + 4
        } else {
          newText = content.substring(0, start) + '**TEXT**' + content.substring(end)
          cursorPos = start + 2
        }
        break
      case 'italic':
        if (selectedText) {
          newText = content.substring(0, start) + `*${selectedText}*` + content.substring(end)
          cursorPos = end + 2
        } else {
          newText = content.substring(0, start) + '*TEXT*' + content.substring(end)
          cursorPos = start + 1
        }
        break
      case 'list':
        newText = content.substring(0, start) + '\n- ' + content.substring(start)
        cursorPos = start + 3
        break
    }

    setContent(newText)
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(cursorPos, cursorPos)
    }, 0)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData ? 'EDIT NOTE' : 'NEW NOTE'}>
      <div className="space-y-4 pb-16">
        {/* Title */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            TITLE *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ENTER TITLE..."
            className="w-full bg-black border-2 border-white px-3 py-2 text-xs font-pixel focus:outline-none focus:shadow-bitmap placeholder:text-gray-600 uppercase"
            maxLength={100}
          />
          <p className="text-[10px] text-gray-500 mt-1 font-pixel">{title.length}/100</p>
        </div>

        {/* Content with formatting toolbar */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            CONTENT * <span className="text-[10px] text-gray-500">(MARKDOWN)</span>
          </label>
          
          {/* Formatting toolbar */}
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => insertFormatting('bold')}
              className="p-2 bg-black border-2 border-white hover:bg-white hover:text-black transition-colors"
              title="BOLD"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('italic')}
              className="p-2 bg-black border-2 border-white hover:bg-white hover:text-black transition-colors"
              title="ITALIC"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('list')}
              className="p-2 bg-black border-2 border-white hover:bg-white hover:text-black transition-colors"
              title="LIST"
            >
              <List size={14} />
            </button>
          </div>

          <textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="ENTER CONTENT...&#10;&#10;MARKDOWN:&#10;**BOLD**&#10;*ITALIC*&#10;- LIST"
            rows={10}
            className="w-full bg-black border-2 border-white px-3 py-2 text-xs font-mono focus:outline-none focus:shadow-bitmap resize-none placeholder:text-gray-600"
            maxLength={5000}
          />
          <p className="text-[10px] text-gray-500 mt-1 font-pixel">{content.length}/5000</p>
        </div>

        {/* Images */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            IMAGES (OPTIONAL)
          </label>
          <ImageUpload
            multiple={true}
            maxFiles={5}
            onImagesSelected={setImages}
            existingImages={images}
          />
        </div>

        {/* Bookmark */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="bookmark"
            checked={bookmarked}
            onChange={(e) => setBookmarked(e.target.checked)}
            className="w-4 h-4 border-2 border-white bg-black accent-white"
          />
          <label htmlFor="bookmark" className="text-xs font-pixel text-white cursor-pointer uppercase">
            ADD TO BOOKMARK
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            CANCEL
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1"
          >
            {initialData ? 'UPDATE' : 'SAVE'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
