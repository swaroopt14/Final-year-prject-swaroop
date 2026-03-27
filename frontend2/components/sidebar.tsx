'use client'

import React, { useState } from 'react'
import {
  BarChart3,
  Users,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  Settings,
  LogOut,
  Brain,
  TrendingUp,
  Activity,
  Zap,
} from 'lucide-react'

interface NavItem {
  icon: React.ReactNode
  label: string
  badge?: string
}

interface AgentItem {
  icon: React.ReactNode
  label: string
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('main')

  const mainNav: NavItem[] = [
    { icon: <BarChart3 size={20} />, label: 'Health History' },
    { icon: <Users size={20} />, label: 'Appointments' },
    { icon: <AlertCircle size={20} />, label: 'Notifications' },
    { icon: <Lightbulb size={20} />, label: 'Wellness' },
    { icon: <MessageSquare size={20} />, label: 'Chat Support' },
  ]

  const agents: AgentItem[] = [
    { icon: <Brain size={18} />, label: 'Health Coach' },
    { icon: <Activity size={18} />, label: 'Nutrition Guide' },
    { icon: <Zap size={18} />, label: 'Fitness Tracker' },
    { icon: <Users size={18} />, label: 'Doctor Profile' },
  ]

  const analytics: NavItem[] = [
    { icon: <TrendingUp size={20} />, label: 'Health Trends' },
    { icon: <Activity size={20} />, label: 'Activity Logs' },
    { icon: <BarChart3 size={20} />, label: 'Wellness Score' },
  ]

  const system: NavItem[] = [
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <LogOut size={20} />, label: 'Logs' },
  ]

  const NavSection = ({
    title,
    items,
    sectionKey,
  }: {
    title: string
    items: NavItem[] | AgentItem[]
    sectionKey: string
  }) => {
    const isExpanded = expandedSection === sectionKey
    const isAgent = sectionKey === 'agents'

    return (
      <div className="mb-6">
        <button
          onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
          className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-white/70 hover:text-white transition-colors"
        >
          <span>{title}</span>
          <ChevronDown
            size={16}
            className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {'badge' in item && item.badge && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-400 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`
        bg-[#8BC34A] border-r border-green-600 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-20' : 'w-64'}
        h-screen sticky top-0 overflow-y-auto
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <span className="font-bold text-white">Health Hub</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${collapsed ? 'rotate-90' : '-rotate-90'}`}
            />
          </button>
        </div>
      </div>

      {/* Navigation */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-4">
          <NavSection title="MAIN" items={mainNav} sectionKey="main" />
          <NavSection title="AGENTS" items={agents} sectionKey="agents" />
          <NavSection title="ANALYTICS" items={analytics} sectionKey="analytics" />
          <NavSection title="SYSTEM" items={system} sectionKey="system" />
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-lg bg-white/20" />
          {!collapsed && <span>Bocchi Rock</span>}
        </button>
      </div>
    </div>
  )
}
