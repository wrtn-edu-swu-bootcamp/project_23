'use client'

import { useState } from 'react'
import { X, Upload, Image as ImageIcon } from 'lucide-react'

type NewFolioItem = {
  title: string
  content: string
  image: File | null
  imagePreview: string | null
}

export default function FolioNewPage() {
  const [formData, setFormData] = useState<NewFolioItem>({
    title: '',
    content: '',
    image: null,
    imagePreview: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview)
    }
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image || !formData.title.trim()) {
      alert('Please add an image and title')
      return
    }

    setIsSubmitting(true)
    
    // Get existing items
    const existingItems = JSON.parse(localStorage.getItem('folio-items') || '[]')
    
    // Create new item
    const newItem = {
      id: Date.now(),
      type: 'image',
      url: formData.imagePreview,
      date: new Date().toISOString().slice(0, 7), // YYYY-MM format
      title: formData.title,
      content: formData.content,
    }
    
    // Add to existing items
    const updatedItems = [newItem, ...existingItems]
    localStorage.setItem('folio-items', JSON.stringify(updatedItems))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Artwork saved successfully!')
    window.location.href = '/folio'
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
          <h1 className="text-xl font-bold">New Artwork</h1>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.image || !formData.title.trim()}
            className="text-deep-purple font-semibold disabled:text-gray-600"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-3">Photo *</label>
          {formData.imagePreview ? (
            <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="block aspect-square bg-gray-900 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Upload size={48} className="mb-3" />
                <span className="text-sm">Tap to upload photo</span>
              </div>
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter artwork title"
            className="w-full bg-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep-purple"
            maxLength={100}
          />
        </div>

        {/* Content/Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Tell us about this artwork..."
            rows={5}
            className="w-full bg-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-deep-purple resize-none"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {formData.content.length}/500
          </div>
        </div>
      </form>
    </div>
  )
}
