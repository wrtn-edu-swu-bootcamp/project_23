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
      className={`bg-[#d4d4c8] border-2 border-black p-3 ${
        onClick ? 'cursor-pointer newton-button' : ''
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
  const baseStyles = 'font-bold border-2 border-black newton-button disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-black text-[#d4d4c8]',
    secondary: 'bg-[#d4d4c8] text-black',
    ghost: 'bg-transparent text-black border-0'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
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
      className={`fixed bottom-28 right-4 w-12 h-12 bg-black text-[#d4d4c8] border-2 border-black rounded-full newton-button flex items-center justify-center z-40 ${className}`}
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
      className={`flex-1 py-2 border-2 border-black text-xs font-bold ${
        active
          ? 'bg-black text-[#d4d4c8]'
          : 'bg-[#d4d4c8] text-black newton-button'
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
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-black">
          {icon}
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-white border-2 border-black ${icon ? 'pl-8' : 'pl-3'} ${onClear && value ? 'pr-8' : 'pr-3'} py-2 text-sm font-mono focus:outline-none focus:border-black`}
      />
      {onClear && value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-black font-bold"
        >
          ✕
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
    <div className="text-center py-12">
      <div className="text-black mb-3 flex justify-center opacity-30">
        {icon}
      </div>
      <p className="text-black text-sm font-mono">{message}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[#d4d4c8] border-4 border-black max-w-[85vw] max-h-[85vh] overflow-y-auto">
        {title && (
          <div className="sticky top-0 bg-[#d4d4c8] border-b-2 border-black px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-black font-bold text-xl w-8 h-8 flex items-center justify-center border-2 border-black newton-button"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-4">
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
      className={`px-3 py-1 text-xs font-bold border-2 border-black whitespace-nowrap ${
        active
          ? 'bg-black text-[#d4d4c8]'
          : 'bg-[#d4d4c8] text-black newton-button'
      }`}
    >
      {children}
    </button>
  )
}

// ==================== Loading Spinner ====================
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  }

  return (
    <div className={`${sizes[size]} border-black border-t-transparent rounded-full animate-spin`} />
  )
}
