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
    <nav className="fixed bottom-0 left-0 right-0 bg-[#d4d4c8] border-t-2 border-black z-50">
      <div className="w-full max-w-[390px] mx-auto">
        <div className="grid grid-cols-4 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-3 rounded border-2 border-black ${
                  isActive 
                    ? 'bg-black text-[#d4d4c8]' 
                    : 'bg-[#d4d4c8] text-black newton-button'
                }`}
              >
                <Icon size={20} strokeWidth={2} />
                <span className="text-[9px] mt-1 font-bold">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export { tabs }
