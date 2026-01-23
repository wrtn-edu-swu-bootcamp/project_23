'use client'

import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  show: boolean
}

export default function LoadingScreen({ show }: LoadingScreenProps) {
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 pixel-grid ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Logo Image Animation */}
      <div className="text-center space-y-6">
        <div className="relative w-48 h-48 mx-auto">
          <img
            src="/assets/logo.png"
            alt="Loading..."
            className="w-full h-full object-contain brightness-0 invert"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
        
        {/* Loading Dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '400ms' }} />
        </div>
        
        <p className="text-gray-400 text-xs font-pixel uppercase tracking-wider">Loading...</p>
      </div>
    </div>
  )
}
