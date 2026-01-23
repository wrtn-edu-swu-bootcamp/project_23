'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LoadingScreenProps {
  show: boolean
  useGif?: boolean // Option to use custom GIF
  gifPath?: string // Path to custom loading GIF
}

export default function LoadingScreen({ 
  show, 
  useGif = true,
  gifPath = '/assets/logo.png'
}: LoadingScreenProps) {
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
      {useGif ? (
        // Logo Image Animation
        <div className="text-center space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            <Image
              src={gifPath}
              alt="Loading..."
              fill
              className="object-contain"
              unoptimized
              priority
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
      ) : (
        // Bitmap Logo Animation
        <div className="text-center space-y-6">
          {/* Triangle Logo Animation */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-white animate-ping opacity-50" 
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} 
            />
            <div className="relative w-full h-full border-4 border-white bg-black flex items-center justify-center"
                 style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            >
              {/* Logo Image */}
              <div className="absolute inset-2">
                <Image
                  src="/assets/logo.png"
                  alt="NAVA Logo"
                  fill
                  className="object-contain animate-pulse"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
          
          {/* Bitmap Loading Blocks */}
          <div className="flex gap-2 justify-center">
            <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="w-3 h-3 border-2 border-white bg-white animate-pulse" style={{ animationDelay: '400ms' }} />
          </div>
          
          <p className="text-gray-400 text-xs font-pixel uppercase tracking-wider">Loading...</p>
        </div>
      )}
    </div>
  )
}
