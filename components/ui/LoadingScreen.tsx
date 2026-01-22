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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center space-y-6">
        {/* Logo Animation */}
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 bg-deep-purple rounded-full animate-ping opacity-20" />
          <div className="relative w-full h-full bg-deep-purple rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold">N</span>
          </div>
        </div>
        
        {/* Loading Dots */}
        <div className="flex gap-2 justify-center">
          <div className="w-2 h-2 bg-deep-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-deep-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-deep-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}
