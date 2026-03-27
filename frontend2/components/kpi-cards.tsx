'use client'

import React from 'react'
import { CardWrapper } from './card-wrapper'
import { AlertCircle, Heart, Zap, Pill, Bed, Clock } from 'lucide-react'

interface KPICardProps {
  icon: React.ReactNode
  title: string
  value: string
  trend: string
  trendColor: 'up' | 'down' | 'neutral'
}

function KPICard({ icon, title, value, trend, trendColor }: KPICardProps) {
  const trendColors = {
    up: 'text-red-600 font-semibold',
    down: 'text-green-700 font-semibold',
    neutral: 'text-gray-600',
  }

  return (
    <CardWrapper className="flex-shrink-0 w-64 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <div className="text-4xl font-bold text-gray-900">{value}</div>
        <span className={`text-xs font-semibold ${trendColors[trendColor]}`}>
          {trend}
        </span>
      </div>
    </CardWrapper>
  )
}

export function KPICards() {
  const kpis = [
    {
      icon: <Heart size={24} />,
      title: 'Heart Rate',
      value: '75.2',
      trend: 'bpm',
      trendColor: 'neutral' as const,
    },
    {
      icon: <AlertCircle size={24} />,
      title: 'Blood Pressure',
      value: '120/80',
      trend: 'normal',
      trendColor: 'down' as const,
    },
    {
      icon: <Zap size={24} />,
      title: 'Energy Level',
      value: '85%',
      trend: '+5%',
      trendColor: 'down' as const,
    },
    {
      icon: <Pill size={24} />,
      title: 'Medications',
      value: '4',
      trend: 'active',
      trendColor: 'neutral' as const,
    },
    {
      icon: <Bed size={24} />,
      title: 'Sleep Quality',
      value: '8.2h',
      trend: '+1h',
      trendColor: 'down' as const,
    },
    {
      icon: <Clock size={24} />,
      title: 'Steps Today',
      value: '8,420',
      trend: '+2k',
      trendColor: 'down' as const,
    },
  ]

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {kpis.map((kpi, idx) => (
        <KPICard key={idx} {...kpi} />
      ))}
    </div>
  )
}
