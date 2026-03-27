'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { HealthMetrics } from './health-metrics'
import { AnalyticsChart } from './analytics-chart'
import { TabNavigation } from './tab-navigation'

export function MainContent() {
  return (
    <div className="flex-1 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Overview Of Your Health</h1>
          <p className="text-slate-600">Health Records</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm text-slate-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Sep 02 - Sep 09
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm text-slate-600">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="11"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            24h
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium">
            Weekly
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Card with Heart and Metrics */}
      <Card className="p-8 bg-white">
        <div className="flex items-center gap-12">
          {/* Heart Illustration */}
          <div className="flex-1 flex justify-center">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cEuJhHFGVwyQyXFVgz7htXcqDnyn2w.png"
              alt="Heart Illustration"
              className="w-96 h-96 object-contain"
            />
          </div>

          {/* Right Side - Metrics */}
          <div className="flex-1 space-y-6">
            <HealthMetrics />
          </div>
        </div>
      </Card>

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
          <h3 className="text-slate-900 font-semibold">Analítica</h3>
        </div>
        <AnalyticsChart />
      </div>

      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  )
}
