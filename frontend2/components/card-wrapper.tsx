import React from 'react'

interface CardWrapperProps {
  children: React.ReactNode
  className?: string
  glow?: boolean
}

export function CardWrapper({ children, className = '', glow = false }: CardWrapperProps) {
  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-xl p-4
        shadow-sm hover:shadow-md transition-shadow
        ${glow ? 'pulse-glow border-red-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
