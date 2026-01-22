'use client'

interface HeaderProps {
  title: string
  rightAction?: React.ReactNode
  leftAction?: React.ReactNode
  children?: React.ReactNode
  transparent?: boolean
}

export default function Header({ 
  title, 
  rightAction, 
  leftAction,
  children,
  transparent = false
}: HeaderProps) {
  return (
    <header className={`sticky top-0 z-40 ${transparent ? 'bg-black/80' : 'bg-black'} border-b-2 border-white px-4 py-4`}>
      <div className="flex items-center justify-between">
        {leftAction ? (
          <div>{leftAction}</div>
        ) : (
          <h1 className="text-xl font-bitmap uppercase tracking-wider">{title}</h1>
        )}
        {rightAction && <div>{rightAction}</div>}
      </div>
      {children && <div className="mt-4">{children}</div>}
    </header>
  )
}
