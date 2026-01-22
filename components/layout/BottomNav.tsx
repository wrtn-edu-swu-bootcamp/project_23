'use client'

import { Image, FileText, Calendar, Newspaper } from 'lucide-react'

export type TabName = 'folio' | 'note' | 'planner' | 'article'

const tabs = [
  { name: 'FOLIO', id: 'folio' as TabName, icon: Image },
  { name: 'NOTE', id: 'note' as TabName, icon: FileText },
  { name: 'PLANNER', id: 'planner' as TabName, icon: Calendar },
  { name: 'ARTICLE', id: 'article' as TabName, icon: Newspaper },
]

interface BottomNavProps {
  activeTab: TabName
  onTabChange: (tab: TabName) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-deep-purple border-t border-gray-800 z-50">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="flex justify-around items-center h-16 px-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors touch-manipulation ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] mt-1 font-medium">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { tabs }
