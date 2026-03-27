import React from 'react'

interface AlertBadgeProps {
  severity: 'critical' | 'warning' | 'info'
  text: string
}

const severityStyles = {
  critical: 'bg-red-100 text-red-700 border border-red-300',
  warning: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  info: 'bg-blue-100 text-blue-700 border border-blue-300',
}

export function AlertBadge({ severity, text }: AlertBadgeProps) {
  return (
    <span
      className={`
        ${severityStyles[severity]}
        border rounded-full text-xs font-medium px-2.5 py-1
        inline-block
      `}
    >
      {text}
    </span>
  )
}
