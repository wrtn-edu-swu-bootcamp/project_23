'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  multiple?: boolean
  maxFiles?: number
  onImagesSelected: (images: UploadedImage[]) => void
  existingImages?: UploadedImage[]
}

export interface UploadedImage {
  id: string
  url: string
  file?: File
  name: string
}

export default function ImageUpload({ 
  multiple = true, 
  maxFiles = 10,
  onImagesSelected,
  existingImages = []
}: ImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length === 0) return

    // Check max files limit
    const remainingSlots = maxFiles - images.length
    const filesToProcess = files.slice(0, remainingSlots)

    const newImages: UploadedImage[] = filesToProcess.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
      name: file.name,
    }))

    const updatedImages = [...images, ...newImages]
    setImages(updatedImages)
    onImagesSelected(updatedImages)

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (id: string) => {
    const imageToRemove = images.find(img => img.id === id)
    if (imageToRemove?.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url)
    }
    
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onImagesSelected(updatedImages)
  }

  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={openFilePicker}
        disabled={images.length >= maxFiles}
        className="w-full border-2 border-dashed border-white bg-black p-6 hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-pixel"
      >
        <div className="flex flex-col items-center gap-2 text-white hover:text-black">
          <Upload size={32} />
          <p className="text-xs uppercase">
            {images.length >= maxFiles 
              ? `MAX ${maxFiles} FILES`
              : 'SELECT FROM GALLERY'}
          </p>
          <p className="text-[10px] text-gray-500">
            {images.length > 0 && `${images.length}/${maxFiles} SELECTED`}
          </p>
        </div>
      </button>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative aspect-square bg-black border-2 border-white overflow-hidden group">
              <Image
                src={image.url}
                alt={image.name}
                fill
                className="object-cover"
                sizes="(max-width: 390px) 33vw, 130px"
              />
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute top-1 right-1 bg-white text-black border border-black p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>

              {/* File name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black border-t border-white p-1 text-[8px] text-white truncate opacity-0 group-hover:opacity-100 transition-opacity font-pixel uppercase">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-xs border-2 border-dashed border-gray-700">
          <ImageIcon size={48} className="mx-auto mb-2 text-gray-700" />
          <p className="font-pixel uppercase">NO IMAGES SELECTED</p>
        </div>
      )}
    </div>
  )
}
