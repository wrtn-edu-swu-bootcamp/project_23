'use client'

interface HeaderProps {
  title: string
  rightAction?: React.ReactNode
  leftAction?: React.ReactNode
  children?: React.ReactNode
}

export default function Header({ 
  title, 
  rightAction, 
  leftAction,
  children,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#d4d4c8] border-b-2 border-black px-3 py-3">
      <div className="flex items-center justify-between mb-2">
        {leftAction ? (
          <div>{leftAction}</div>
        ) : (
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        )}
        {rightAction && <div>{rightAction}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
