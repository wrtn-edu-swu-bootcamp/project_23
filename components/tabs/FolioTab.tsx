'use client'

import { useState, useEffect } from 'react'
import { Plus, Grid3x3, LayoutGrid, Edit2, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import { FloatingButton, Modal, Button, EmptyState } from '@/components/ui/CommonUI'
import FolioUploadModal, { FolioUploadData } from '@/components/ui/FolioUploadModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface FolioItem {
  id: number
  type: 'image' | 'video'
  url: string
  date: string // YYYY-MM format
  title: string
  caption?: string
}

const mockData: FolioItem[] = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800', date: '2024-01', title: 'Abstract Painting', caption: 'Experimenting with colors' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800', date: '2024-01', title: 'Gallery Visit' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800', date: '2024-01', title: 'Sketch Studies' },
]

export default function FolioTab() {
  const [items, setItems] = useState<FolioItem[]>([])
  const [gridCols, setGridCols] = useState<2 | 3>(3)
  const [selectedItem, setSelectedItem] = useState<FolioItem | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FolioItem | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; item: FolioItem | null }>({
    isOpen: false,
    item: null,
  })

  useEffect(() => {
    const saved = localStorage.getItem('folio-items')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(mockData)
      localStorage.setItem('folio-items', JSON.stringify(mockData))
    }
  }, [])

  const handleUpload = (data: FolioUploadData) => {
    if (data.id) {
      // Edit existing item
      const updatedItems = items.map(item => {
        if (item.id === data.id) {
          return {
            ...item,
            url: data.images[0]?.url || item.url,
            date: data.date,
            title: data.title,
            caption: data.caption,
          }
        }
        return item
      })
      setItems(updatedItems)
      localStorage.setItem('folio-items', JSON.stringify(updatedItems))
      setEditingItem(null)
    } else {
      // Create new items from uploaded images
      const newItems: FolioItem[] = data.images.map((img, index) => ({
        id: Date.now() + index,
        type: 'image' as const,
        url: img.url,
        date: data.date,
        title: data.images.length > 1 ? `${data.title} ${index + 1}` : data.title,
        caption: data.caption,
      }))

      const updatedItems = [...newItems, ...items]
      setItems(updatedItems)
      localStorage.setItem('folio-items', JSON.stringify(updatedItems))
    }
    setIsUploadModalOpen(false)
  }

  const handleEdit = (item: FolioItem) => {
    setEditingItem(item)
    setSelectedItem(null)
    setIsUploadModalOpen(true)
  }

  const handleDeleteConfirm = (item: FolioItem) => {
    setDeleteConfirm({ isOpen: true, item })
    setSelectedItem(null)
  }

  const handleDelete = () => {
    if (deleteConfirm.item) {
      const updatedItems = items.filter(item => item.id !== deleteConfirm.item!.id)
      setItems(updatedItems)
      localStorage.setItem('folio-items', JSON.stringify(updatedItems))
      setDeleteConfirm({ isOpen: false, item: null })
    }
  }

  const openNewUpload = () => {
    setEditingItem(null)
    setIsUploadModalOpen(true)
  }

  // Group by date
  const groupedByDate = items.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = []
    acc[item.date].push(item)
    return acc
  }, {} as Record<string, FolioItem[]>)

  const toggleGrid = () => {
    setGridCols(gridCols === 2 ? 3 : 2)
  }

  return (
    <div className="min-h-screen pb-24">
      <Header 
        title="FOLIO"
        rightAction={
          <button
            onClick={toggleGrid}
            className="p-2 border-2 border-white bg-black hover:bg-white hover:text-black transition-colors"
          >
            {gridCols === 2 ? <Grid3x3 size={16} /> : <LayoutGrid size={16} />}
          </button>
        }
      />

      {/* Content */}
      <div className="px-2 pt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<Plus size={48} />}
            message="작품을 업로드하여 포트폴리오를 시작하세요"
          />
        ) : (
          Object.keys(groupedByDate)
            .sort()
            .reverse()
            .map((date) => (
              <div key={date} className="mb-8">
                {/* Sticky Date Header */}
                <div className="sticky top-[73px] z-30 bg-black border-b-2 border-white py-2 mb-3">
                  <h2 className="text-xs font-pixel uppercase tracking-wider text-white px-2">
                    {new Date(date + '-01').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </h2>
                </div>

                {/* Grid */}
                <div className={`grid ${gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-2`}>
                  {groupedByDate[date].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="aspect-square bg-black border-2 border-white overflow-hidden relative group cursor-pointer hover:shadow-bitmap transition-all"
                    >
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 390px) 33vw, 130px"
                      />
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <span className="text-[10px] text-white text-center line-clamp-3 font-pixel uppercase">
                          {item.title}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative w-full aspect-square border-2 border-white">
              <Image
                src={selectedItem.url}
                alt={selectedItem.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            {selectedItem.caption && (
              <p className="text-gray-400 text-xs font-pixel">{selectedItem.caption}</p>
            )}
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={() => handleDeleteConfirm(selectedItem)}
                className="flex-1 border-2 border-white bg-black text-white hover:bg-white hover:text-black"
              >
                <Trash2 size={14} className="mr-1" />
                DEL
              </Button>
              <Button 
                variant="primary" 
                onClick={() => handleEdit(selectedItem)}
                className="flex-1"
              >
                <Edit2 size={14} className="mr-1" />
                EDIT
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Modal */}
      <FolioUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false)
          setEditingItem(null)
        }}
        onSubmit={handleUpload}
        initialData={editingItem ? {
          id: editingItem.id,
          title: editingItem.title,
          caption: editingItem.caption || '',
          date: editingItem.date,
          images: [{
            id: String(editingItem.id),
            url: editingItem.url,
            name: editingItem.title,
          }]
        } : undefined}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="DELETE WORK"
        message={`Delete "${deleteConfirm.item?.title}"? This action cannot be undone.`}
      />

      <FloatingButton 
        icon={<Plus size={24} />} 
        onClick={openNewUpload}
      />
    </div>
  )
}
