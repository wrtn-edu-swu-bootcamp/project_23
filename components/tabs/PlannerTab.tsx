'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, MapPin, Heart, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '@/components/layout/Header'
import { Card, Chip, EmptyState } from '@/components/ui/CommonUI'

interface Exhibition {
  id: number
  title: string
  location: string
  region: string
  startDate: string
  endDate: string
  poster: string
  url: string
  visited: boolean
}

const regions = ['All', 'Seoul', 'Gyeonggi', 'Busan', 'Incheon']

const mockExhibitions: Exhibition[] = [
  {
    id: 1,
    title: 'Contemporary Art Exhibition 2024',
    location: 'Seoul Museum of Art',
    region: 'Seoul',
    startDate: '2024-01-15',
    endDate: '2024-03-20',
    poster: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400',
    url: 'https://example.com',
    visited: false,
  },
  {
    id: 2,
    title: 'Abstract Expressionism',
    location: 'National Museum',
    region: 'Seoul',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    poster: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    url: 'https://example.com',
    visited: false,
  },
]

export default function PlannerTab() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([])
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeView, setActiveView] = useState<'calendar' | 'wishlist'>('calendar')

  useEffect(() => {
    const saved = localStorage.getItem('planner-exhibitions')
    const savedWishlist = localStorage.getItem('planner-wishlist')

    if (saved) {
      setExhibitions(JSON.parse(saved))
    } else {
      setExhibitions(mockExhibitions)
      localStorage.setItem('planner-exhibitions', JSON.stringify(mockExhibitions))
    }

    if (savedWishlist) {
      setWishlist(new Set(JSON.parse(savedWishlist)))
    }
  }, [])

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      localStorage.setItem('planner-wishlist', JSON.stringify(Array.from(newSet)))
      return newSet
    })
  }

  const toggleVisited = (id: number) => {
    setExhibitions((prev) => {
      const updated = prev.map((ex) =>
        ex.id === id ? { ...ex, visited: !ex.visited } : ex
      )
      localStorage.setItem('planner-exhibitions', JSON.stringify(updated))
      return updated
    })
  }

  const getDaysUntilClose = (endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const filteredExhibitions = exhibitions.filter((ex) => {
    const matchesRegion = selectedRegion === 'All' || ex.region === selectedRegion
    const matchesView = activeView === 'calendar' || wishlist.has(ex.id)
    return matchesRegion && matchesView
  })

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title="PLANNER">
        {/* Region Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {regions.map((region) => (
            <Chip
              key={region}
              active={selectedRegion === region}
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Chip>
          ))}
        </div>

        {/* Calendar/Wishlist Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('calendar')}
            className={`flex-1 py-2 border-2 text-xs font-pixel uppercase transition-all ${
              activeView === 'calendar' 
                ? 'bg-white text-black border-white shadow-bitmap' 
                : 'bg-black text-white border-white hover:bg-white hover:text-black'
            }`}
          >
            <CalendarIcon size={14} className="inline mr-1" />
            CAL
          </button>
          <button
            onClick={() => setActiveView('wishlist')}
            className={`flex-1 py-2 border-2 text-xs font-pixel uppercase transition-all ${
              activeView === 'wishlist' 
                ? 'bg-white text-black border-white shadow-bitmap' 
                : 'bg-black text-white border-white hover:bg-white hover:text-black'
            }`}
          >
            <Heart size={14} className="inline mr-1" />
            WISH
          </button>
        </div>
      </Header>

      {/* Mini Calendar */}
      <div className="px-4 py-4 border-b-2 border-white">
        <div className="flex items-center justify-between mb-3">
          <button onClick={prevMonth} className="p-2 border-2 border-white bg-black hover:bg-white hover:text-black transition-colors">
            <ChevronLeft size={16} />
          </button>
          <h3 className="font-pixel text-sm uppercase">
            {currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </h3>
          <button onClick={nextMonth} className="p-2 border-2 border-white bg-black hover:bg-white hover:text-black transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Exhibitions List */}
      <div className="px-4 py-6 space-y-4">
        {filteredExhibitions.length === 0 ? (
          <EmptyState
            icon={<CalendarIcon size={48} />}
            message={activeView === 'wishlist' ? '위시리스트가 비어있습니다' : '전시 정보가 없습니다'}
          />
        ) : (
          filteredExhibitions.map((exhibition) => {
            const daysLeft = getDaysUntilClose(exhibition.endDate)

            return (
              <Card key={exhibition.id} className="relative">
                <div className="flex gap-4">
                  <div
                    className="w-24 h-24 flex-shrink-0 bg-black border-2 border-white bg-cover bg-center"
                    style={{ backgroundImage: `url(${exhibition.poster})` }}
                  />
                  <div className="flex-1">
                    <h3 className="font-pixel text-xs mb-2 line-clamp-2 uppercase">{exhibition.title}</h3>
                    <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1 font-pixel">
                      <MapPin size={10} />
                      {exhibition.location}
                    </p>
                    <p className="text-[10px] text-gray-500 font-pixel">
                      {new Date(exhibition.startDate).toLocaleDateString('ko-KR')} ~{' '}
                      {new Date(exhibition.endDate).toLocaleDateString('ko-KR')}
                    </p>
                    {daysLeft >= 0 && (
                      <p className="text-[10px] text-white mt-1 font-pixel border border-white inline-block px-1">D-{daysLeft}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleWishlist(exhibition.id)}
                    className="border-2 border-white p-1 hover:bg-white hover:text-black transition-colors"
                  >
                    <Heart
                      size={16}
                      className={wishlist.has(exhibition.id) ? 'fill-white' : ''}
                    />
                  </button>
                  <button
                    onClick={() => toggleVisited(exhibition.id)}
                    className={`text-[10px] px-2 py-1 border-2 font-pixel uppercase ${
                      exhibition.visited ? 'bg-white text-black border-white' : 'bg-black text-white border-white hover:bg-gray-900'
                    }`}
                  >
                    {exhibition.visited ? 'VISITED' : 'MARK'}
                  </button>
                  <a
                    href={exhibition.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-[10px] text-white hover:underline flex items-center gap-1 font-pixel uppercase border-2 border-white px-2 py-1 hover:bg-white hover:text-black transition-colors"
                  >
                    INFO <ExternalLink size={10} />
                  </a>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
