'use client'

import React from 'react'

// ==================== Card Component ====================
export function Card({ 
  children, 
  className = '', 
  onClick 
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-black border-2 border-white p-4 shadow-bitmap hover:shadow-bitmap-lg transition-all font-pixel ${
        onClick ? 'cursor-pointer active:translate-x-[2px] active:translate-y-[2px]' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

// ==================== Button Component ====================
export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick
}: { 
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  onClick?: () => void
}) {
  const baseStyles = 'font-pixel border-2 transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed uppercase'
  
  const variants = {
    primary: 'bg-white text-black border-white shadow-bitmap-btn hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px]',
    secondary: 'bg-black text-white border-white shadow-bitmap-btn hover:bg-gray-900 active:translate-x-[2px] active:translate-y-[2px]',
    ghost: 'bg-transparent text-white border-white hover:bg-white hover:text-black'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-4 py-2 text-xs',
    lg: 'px-6 py-3 text-sm'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}

// ==================== Floating Action Button ====================
export function FloatingButton({ 
  icon, 
  onClick,
  className = ''
}: { 
  icon: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 w-14 h-14 bg-white text-black border-2 border-black shadow-bitmap-btn flex items-center justify-center hover:bg-gray-100 active:translate-x-[2px] active:translate-y-[2px] transition-all z-40 ${className}`}
    >
      {icon}
    </button>
  )
}

// ==================== Tab Button ====================
export function TabButton({
  active,
  children,
  onClick
}: {
  active: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 border-2 text-xs font-pixel uppercase transition-all ${
        active
          ? 'bg-white text-black border-white'
          : 'bg-black text-white border-white hover:bg-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

// ==================== Search Input ====================
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  icon,
  onClear
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  icon?: React.ReactNode
  onClear?: () => void
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-black border-2 border-white ${icon ? 'pl-10' : 'pl-4'} ${onClear && value ? 'pr-10' : 'pr-4'} py-2.5 text-sm font-pixel focus:outline-none focus:shadow-bitmap transition-all placeholder:text-gray-600`}
      />
      {onClear && value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white font-pixel text-xs"
        >
          X
        </button>
      )}
    </div>
  )
}

// ==================== Empty State ====================
export function EmptyState({ 
  icon, 
  message,
  action
}: { 
  icon: React.ReactNode
  message: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12 border-2 border-dashed border-gray-700">
      <div className="text-gray-600 mb-3 flex justify-center">
        {icon}
      </div>
      <p className="text-gray-500 mb-4 font-pixel text-xs">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ==================== Modal ====================
export function Modal({
  isOpen,
  onClose,
  children,
  title
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 pixel-grid overflow-y-auto">
      <div className="bg-black border-4 border-white w-full max-w-[390px] my-4 mx-4 shadow-bitmap-lg flex flex-col max-h-[95vh]">
        {title && (
          <div className="sticky top-0 bg-black border-b-2 border-white px-6 py-4 flex justify-between items-center flex-shrink-0 z-10">
            <h2 className="text-lg font-bitmap uppercase">{title}</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-400 font-bitmap text-xl"
            >
              X
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// ==================== Chip/Tag ====================
export function Chip({
  children,
  active = false,
  onClick
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 border-2 text-xs font-pixel uppercase transition-all whitespace-nowrap ${
        active
          ? 'bg-white text-black border-white shadow-bitmap'
          : 'bg-black text-white border-white hover:bg-gray-900'
      }`}
    >
      {children}
    </button>
  )
}

// ==================== Loading Spinner ====================
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 border-2 border-white animate-ping" />
      <div className="absolute inset-0 border-2 border-white" style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' 
      }} />
    </div>
  )
}
