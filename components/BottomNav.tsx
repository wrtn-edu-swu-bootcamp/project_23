'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Image, FileText, Calendar, Newspaper, Bot } from 'lucide-react'

const tabs = [
  { name: 'FOLIO', path: '/folio', icon: Image },
  { name: 'NOTE', path: '/note', icon: FileText },
  { name: 'PLANNER', path: '/planner', icon: Calendar },
  { name: 'ARTICLE', path: '/article', icon: Newspaper },
  { name: 'VV', path: '/vv', icon: Bot },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-deep-purple border-t border-gray-800 z-50 safe-area-bottom">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.path
            
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors touch-manipulation ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-medium">{tab.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
