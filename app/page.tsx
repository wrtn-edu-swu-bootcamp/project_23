'use client'

import { useState } from 'react'
import BottomNav, { TabName } from '@/components/layout/BottomNav'
import LoadingScreen from '@/components/ui/LoadingScreen'
import dynamic from 'next/dynamic'

// Lazy load tab components
const FolioTab = dynamic(() => import('@/components/tabs/FolioTab'), {
  loading: () => <LoadingScreen show={true} />,
})

const NoteTab = dynamic(() => import('@/components/tabs/NoteTab'), {
  loading: () => <LoadingScreen show={true} />,
})

const ArticleTab = dynamic(() => import('@/components/tabs/ArticleTab'), {
  loading: () => <LoadingScreen show={true} />,
})

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabName>('folio')
  const [isLoading, setIsLoading] = useState(false)

  const handleTabChange = (tab: TabName) => {
    if (tab === activeTab) return
    
    setIsLoading(true)
    setTimeout(() => {
      setActiveTab(tab)
      setIsLoading(false)
    }, 200)
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'folio':
        return <FolioTab />
      case 'note':
        return <NoteTab />
      case 'article':
        return <ArticleTab />
      default:
        return null
    }
  }

  return (
    <>
      <LoadingScreen show={isLoading} />
      
      <div className="min-h-screen bg-black">
        {renderTab()}
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </>
  )
}
