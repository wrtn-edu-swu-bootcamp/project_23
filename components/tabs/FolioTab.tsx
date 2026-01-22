'use client'

import { useState, useEffect } from 'react'
import { Plus, Grid3x3, LayoutGrid } from 'lucide-react'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import { FloatingButton, Modal, Button, EmptyState } from '@/components/ui/CommonUI'

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

  useEffect(() => {
    const saved = localStorage.getItem('folio-items')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(mockData)
      localStorage.setItem('folio-items', JSON.stringify(mockData))
    }
  }, [])

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
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {gridCols === 2 ? <Grid3x3 size={20} /> : <LayoutGrid size={20} />}
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
                <div className="sticky top-[73px] z-30 bg-black/90 backdrop-blur-sm py-2 mb-3">
                  <h2 className="text-sm font-semibold text-gray-400 px-2">
                    {new Date(date + '-01').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </h2>
                </div>

                {/* Grid */}
                <div className={`grid ${gridCols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1`}>
                  {groupedByDate[date].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="aspect-square bg-gray-900 rounded-sm overflow-hidden relative group cursor-pointer"
                    >
                      <Image
                        src={item.url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 390px) 33vw, 130px"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                        <span className="text-xs text-white text-center line-clamp-2">
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
            <div className="relative w-full aspect-square">
              <Image
                src={selectedItem.url}
                alt={selectedItem.title}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </div>
            {selectedItem.caption && (
              <p className="text-gray-400 text-sm">{selectedItem.caption}</p>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                닫기
              </Button>
              <Button variant="primary">편집</Button>
            </div>
          </div>
        )}
      </Modal>

      <FloatingButton icon={<Plus size={24} />} />
    </div>
  )
}
