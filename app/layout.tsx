import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NAVA - Art Portfolio & Docent',
  description: 'Mobile-optimized Art Portfolio & Browser for Artists',
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
    <html lang="ko" className={inter.variable}>
      <body className="font-sans">
        <div className="min-h-screen bg-black text-white">
          {/* iPhone 14 frame: 390x844 */}
          <div className="w-full max-w-[390px] min-h-screen mx-auto relative bg-black">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
