import React from 'react'

interface AgentTagProps {
  agent: 'Doctor' | 'Nurse' | 'Drug' | 'Admin'
  size?: 'sm' | 'md'
}

const agentColors = {
  Doctor: 'bg-blue-100 text-blue-700 border border-blue-300',
  Nurse: 'bg-green-100 text-green-700 border border-green-300',
  Drug: 'bg-purple-100 text-purple-700 border border-purple-300',
  Admin: 'bg-amber-100 text-amber-700 border border-amber-300',
}

export function AgentTag({ agent, size = 'sm' }: AgentTagProps) {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'
  const padding = size === 'sm' ? 'px-2 py-1' : 'px-3 py-1.5'

  return (
    <span
      className={`
        ${agentColors[agent]}
        border rounded-full font-medium inline-block
        ${textSize} ${padding}
      `}
    >
      {agent} Agent
    </span>
  )
}
