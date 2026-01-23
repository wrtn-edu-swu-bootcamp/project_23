'use client'

import { Image, FileText, Newspaper } from 'lucide-react'

export type TabName = 'folio' | 'note' | 'article'

const tabs = [
  { name: 'FOLIO', id: 'folio' as TabName, icon: Image },
  { name: 'NOTE', id: 'note' as TabName, icon: FileText },
  { name: 'ARTICLE', id: 'article' as TabName, icon: Newspaper },
]

interface BottomNavProps {
  activeTab: TabName
  onTabChange: (tab: TabName) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-white z-50">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="grid grid-cols-3 h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center border-r-2 last:border-r-0 border-white transition-colors touch-manipulation ${
                  isActive ? 'bg-white text-black' : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[8px] mt-1 font-pixel uppercase tracking-wider">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { tabs }
