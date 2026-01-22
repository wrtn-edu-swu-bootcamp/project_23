'use client'

import { useState, useEffect } from 'react'
import { Modal, Button } from './CommonUI'
import ImageUpload, { UploadedImage } from './ImageUpload'

interface FolioUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FolioUploadData) => void
  initialData?: Partial<FolioUploadData> & { id?: number }
}

export interface FolioUploadData {
  id?: number
  images: UploadedImage[]
  title: string
  caption: string
  date: string
}

export default function FolioUploadModal({ isOpen, onClose, onSubmit, initialData }: FolioUploadModalProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [title, setTitle] = useState('')
  const [caption, setCaption] = useState('')
  const [date, setDate] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  // Load initial data when editing
  useEffect(() => {
    if (initialData && isOpen) {
      setImages(initialData.images || [])
      setTitle(initialData.title || '')
      setCaption(initialData.caption || '')
      setDate(initialData.date || (() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      })())
    } else if (!isOpen) {
      // Reset when closing
      setImages([])
      setTitle('')
      setCaption('')
      const now = new Date()
      setDate(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`)
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (images.length === 0) {
      alert('SELECT AT LEAST ONE IMAGE')
      return
    }

    if (!title.trim()) {
      alert('ENTER A TITLE')
      return
    }

    onSubmit({
      id: initialData?.id,
      images,
      title: title.trim(),
      caption: caption.trim(),
      date,
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={initialData?.id ? "EDIT WORK" : "UPLOAD WORK"}>
      <div className="space-y-4 pb-16">
        {/* Image Upload */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            IMAGE *
          </label>
          <ImageUpload
            multiple={true}
            maxFiles={10}
            onImagesSelected={setImages}
            existingImages={images}
          />
        </div>

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

        {/* Date */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            DATE (YYYY-MM)
          </label>
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-black border-2 border-white px-3 py-2 text-xs font-pixel focus:outline-none focus:shadow-bitmap"
          />
        </div>

        {/* Caption */}
        <div>
          <label className="block text-xs font-pixel mb-2 text-white uppercase">
            CAPTION (OPTIONAL)
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="ENTER CAPTION..."
            rows={4}
            className="w-full bg-black border-2 border-white px-3 py-2 text-xs font-pixel focus:outline-none focus:shadow-bitmap resize-none placeholder:text-gray-600"
            maxLength={500}
          />
          <p className="text-[10px] text-gray-500 mt-1 font-pixel">{caption.length}/500</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <Button variant="secondary" onClick={handleClose} className="flex-1">
            CANCEL
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={images.length === 0 || !title.trim()}
            className="flex-1"
          >
            {initialData?.id ? 'UPDATE' : 'UPLOAD'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
