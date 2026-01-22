'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen({ show }: { show: boolean }) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#d4d4c8] transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-6">
        {/* Newton-style logo */}
        <div className="relative w-24 h-24 mx-auto border-4 border-black bg-[#d4d4c8] flex items-center justify-center">
          <span className="text-5xl font-bold">N</span>
        </div>
        
        {/* Loading dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-black animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="text-black text-sm font-mono">Loading...</p>
      </div>
    </div>
  )
}
