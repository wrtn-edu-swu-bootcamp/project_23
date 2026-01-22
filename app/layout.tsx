import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NAVA',
  description: 'Art Portfolio Manager',
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
      <body>
        <div className="min-h-screen bg-[#d4d4c8]">
          {/* Newton PDA frame */}
          <div className="w-full max-w-[390px] min-h-screen mx-auto relative bg-[#d4d4c8] border-x-4 border-black">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
