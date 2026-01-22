import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold tracking-tight">NAVA</h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Art-focused Mobile Web Portfolio & Browser App
        </p>
        
        <div className="mt-12 space-y-4">
          <Link 
            href="/folio"
            className="block w-full py-4 px-8 bg-deep-purple rounded-xl font-semibold hover:bg-opacity-80 transition-all active:scale-95"
          >
            Start Exploring
          </Link>
        </div>
      </div>
    </main>
  )
}
