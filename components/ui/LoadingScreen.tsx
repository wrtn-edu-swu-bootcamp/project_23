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
      <div className="text-center space-y-8">
        {/* Logo with glow effect */}
        <div className="relative w-64 h-64 mx-auto">
          {/* Glow background */}
          <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full animate-pulse" />
          
          {/* Logo image */}
          <div className="relative w-full h-full p-8 bg-white/5 border-2 border-white/20 backdrop-blur-sm">
            <img
              src="/assets/logo.png"
              alt="Loading..."
              className="w-full h-full object-contain"
              style={{ 
                imageRendering: 'crisp-edges',
                WebkitImageSmoothing: 'high'
              }}
            />
          </div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex gap-3 justify-center">
          <div className="w-4 h-4 border-2 border-white bg-white animate-pulse shadow-bitmap" style={{ animationDelay: '0ms' }} />
          <div className="w-4 h-4 border-2 border-white bg-white animate-pulse shadow-bitmap" style={{ animationDelay: '200ms' }} />
          <div className="w-4 h-4 border-2 border-white bg-white animate-pulse shadow-bitmap" style={{ animationDelay: '400ms' }} />
        </div>
        
        <p className="text-white text-sm font-pixel uppercase tracking-widest animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
