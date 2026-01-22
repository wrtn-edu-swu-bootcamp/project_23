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
      className={`bg-gray-900/50 rounded-xl p-4 hover:bg-gray-900/70 transition-all ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
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
  const baseStyles = 'font-medium rounded-lg transition-all active:scale-95 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-deep-purple text-white hover:bg-opacity-80',
    secondary: 'bg-gray-800 text-gray-300 hover:bg-gray-700',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
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
      className={`fixed bottom-24 right-6 w-14 h-14 bg-deep-purple rounded-full shadow-lg flex items-center justify-center hover:bg-opacity-80 transition-all active:scale-95 z-40 ${className}`}
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
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-deep-purple text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
        className={`w-full bg-gray-900 rounded-lg ${icon ? 'pl-10' : 'pl-4'} ${onClear && value ? 'pr-10' : 'pr-4'} py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-deep-purple transition-all`}
      />
      {onClear && value && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
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
      <div className="text-gray-600 mb-3 flex justify-center">
        {icon}
      </div>
      <p className="text-gray-500 mb-4">{message}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl max-w-[90vw] max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">
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
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
        active
          ? 'bg-deep-purple text-white'
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
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
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  }

  return (
    <div className={`${sizes[size]} border-gray-700 border-t-deep-purple rounded-full animate-spin`} />
  )
}
