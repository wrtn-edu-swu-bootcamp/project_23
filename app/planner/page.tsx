'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin, Heart, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

const regions = ['All', 'Seoul', 'Gyeonggi', 'Busan', 'Incheon', 'Daegu']

// 더 많은 전시 데이터
const generateMockExhibitions = (count: number) => {
  const titles = [
    'Contemporary Art Exhibition 2024',
    'Abstract Expressionism',
    'Digital Art Festival',
    'Korean Traditional Art',
    'Modern Sculpture Exhibition',
    'Photography Masters',
    'Minimalist Art Showcase',
    'Urban Art Revolution',
    'Nature in Art',
    'Portrait Gallery',
    'Installation Art Show',
    'Mixed Media Exhibition',
    'Street Art Festival',
    'Ceramic Art Collection',
    'Video Art Experience',
  ]
  
  const locations = [
    'Seoul Museum of Art',
    'National Museum',
    'Busan Art Center',
    'Incheon Art Platform',
    'Daegu Art Museum',
    'Gyeonggi Museum',
    'Contemporary Art Space',
    'Gallery 63',
    'Art Center Nabi',
  ]
  
  const regionsList = ['Seoul', 'Gyeonggi', 'Busan', 'Incheon', 'Daegu']
  
  const images = [
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01d3c3f?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1569172122301-bc5008bc09c5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format&fit=crop',
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length],
    location: locations[i % locations.length],
    region: regionsList[i % regionsList.length],
    startDate: new Date(2024, Math.floor(i / 5), (i % 28) + 1).toISOString().split('T')[0],
    endDate: new Date(2024, Math.floor(i / 5) + 2, (i % 28) + 1).toISOString().split('T')[0],
    poster: images[i % images.length],
    url: 'https://example.com',
  }))
}

const allExhibitions = generateMockExhibitions(50)

export default function PlannerPage() {
  const [selectedRegion, setSelectedRegion] = useState('All')
  const [activeTab, setActiveTab] = useState<'calendar' | 'favorites'>('calendar')
  const [wishedExhibitions, setWishedExhibitions] = useState(new Set<number>())
  const [currentDate, setCurrentDate] = useState(new Date())
  const [displayedCount, setDisplayedCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Load wishlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('planner-wishlist')
    if (saved) {
      setWishedExhibitions(new Set(JSON.parse(saved)))
    }
  }, [])

  const toggleWish = (id: number) => {
    setWishedExhibitions(prev => {
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

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate)
  const today = new Date()
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && 
                        currentDate.getFullYear() === today.getFullYear()

  const filteredExhibitions = allExhibitions.filter(ex => {
    const matchesRegion = selectedRegion === 'All' || ex.region === selectedRegion
    const matchesTab = activeTab === 'calendar' || wishedExhibitions.has(ex.id)
    return matchesRegion && matchesTab
  })

  const displayedExhibitions = filteredExhibitions.slice(0, displayedCount)
  const hasMore = displayedCount < filteredExhibitions.length

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true)
          setTimeout(() => {
            setDisplayedCount(prev => Math.min(prev + 5, filteredExhibitions.length))
            setIsLoading(false)
          }, 800)
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading, filteredExhibitions.length])

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedCount(5)
  }, [selectedRegion, activeTab])

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-sm border-b border-gray-800 px-4 py-4">
        <h1 className="text-2xl font-bold mb-4">PLANNER</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'calendar'
                ? 'bg-deep-purple text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            Exhibitions
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-deep-purple text-white'
                : 'bg-gray-800 text-gray-400'
            }`}
          >
            <span className="flex items-center justify-center gap-1">
              <Heart size={16} />
              Wishlist
            </span>
          </button>
        </div>
        
        {/* Region Filter Chips */}
        {activeTab === 'calendar' && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedRegion === region
                    ? 'bg-deep-purple text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Monthly Calendar */}
      {activeTab === 'calendar' && (
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-800 rounded-lg">
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>
          {/* Simple Calendar Grid */}
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-gray-500 font-semibold">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const isToday = isCurrentMonth && day === today.getDate()
                return (
                  <div
                    key={day}
                    className={`aspect-square flex items-center justify-center rounded-lg ${
                      isToday
                        ? 'bg-deep-purple text-white font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 cursor-pointer'
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Exhibition Cards */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {activeTab === 'favorites' ? 'My Wishlist' : 'Ongoing Exhibitions'}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredExhibitions.length} total
          </span>
        </div>
        
        {displayedExhibitions.map((exhibition) => (
          <div
            key={exhibition.id}
            className="bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all active:scale-[0.98]"
          >
            {/* Poster with Thumbnail */}
            <div className="flex gap-3 p-3">
              <div className="w-28 h-28 flex-shrink-0 bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={exhibition.poster}
                  alt={exhibition.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base mb-1 line-clamp-2">{exhibition.title}</h3>
                
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{exhibition.location}</span>
                </div>
                
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <Calendar size={12} className="mr-1 flex-shrink-0" />
                  <span>
                    {new Date(exhibition.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    {new Date(exhibition.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleWish(exhibition.id)}
                    className="p-1.5 bg-gray-800 rounded-full hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    <Heart
                      size={14}
                      className={wishedExhibitions.has(exhibition.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                    />
                  </button>
                  <a
                    href={exhibition.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-gray-800 rounded-full hover:bg-gray-700 active:scale-95 transition-all"
                  >
                    <ExternalLink size={14} className="text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-deep-purple" size={32} />
          </div>
        )}

        {/* Infinite scroll trigger */}
        {hasMore && !isLoading && <div ref={observerRef} className="h-4" />}

        {/* Empty state */}
        {filteredExhibitions.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto mb-3 text-gray-600" size={48} />
            <p className="text-gray-500">
              {activeTab === 'favorites' ? 'No exhibitions in wishlist' : 'No exhibitions found'}
            </p>
          </div>
        )}

        {/* End of list */}
        {!hasMore && displayedExhibitions.length > 0 && (
          <div className="text-center py-8 text-sm text-gray-500">
            You've reached the end
          </div>
        )}
      </div>
    </div>
  )
}
