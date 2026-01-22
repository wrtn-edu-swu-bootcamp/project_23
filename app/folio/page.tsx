'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// 임시 데이터
const initialMockData = [
  { id: 1, type: 'image', url: '/assets/logo.png', date: '2024-01', title: 'Artwork 1', content: 'Sample artwork' },
  { id: 2, type: 'image', url: '/assets/logo.png', date: '2024-01', title: 'Artwork 2', content: 'Sample artwork' },
  { id: 3, type: 'image', url: '/assets/logo.png', date: '2024-01', title: 'Artwork 3', content: 'Sample artwork' },
]

export default function FolioPage() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('folio-items')
    if (saved) {
      setItems(JSON.parse(saved))
    } else {
      setItems(initialMockData)
      localStorage.setItem('folio-items', JSON.stringify(initialMockData))
    }
  }, [])

  // 날짜별로 그룹화
  const groupedByDate = items.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = []
    acc[item.date].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <h1 className="text-2xl font-bold">FOLIO</h1>
      </header>

      {/* Content */}
      <div className="px-2 pt-4">
        {Object.keys(groupedByDate).sort().reverse().map((date) => (
          <div key={date} className="mb-8">
            {/* Sticky Date Header */}
            <div className="sticky top-16 z-30 bg-black/90 backdrop-blur-sm py-2 mb-3">
              <h2 className="text-sm font-semibold text-gray-400 px-2">
                {new Date(date + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
              </h2>
            </div>

            {/* 3-Column Grid */}
            <div className="grid grid-cols-3 gap-1">
              {groupedByDate[date].map((item) => (
                <div
                  key={item.id}
                  className="aspect-square bg-gray-900 rounded-sm overflow-hidden relative group"
                >
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs text-white">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Upload Button */}
      <Link
        href="/folio/new"
        className="fixed bottom-24 right-6 w-14 h-14 bg-deep-purple rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-80 transition-all active:scale-95 z-40"
      >
        <Plus size={24} />
      </Link>
    </div>
  )
}
