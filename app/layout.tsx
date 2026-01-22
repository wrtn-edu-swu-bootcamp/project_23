import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import BottomNav from '@/components/BottomNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NAVA - Art Portfolio & Docent',
  description: 'Art-focused Mobile Web Portfolio & Browser App',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          {/* iPhone 13/14 frame: 390x844 */}
          <div className="w-full max-w-[390px] min-h-screen mx-auto relative pb-20 bg-black">
            {children}
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
