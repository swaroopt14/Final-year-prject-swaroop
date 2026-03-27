'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'

const tabs = [
  { id: 'tracker', label: 'Tracker', active: true },
  { id: 'medical', label: 'MedicalAnalytics', active: false },
  { id: 'fitness', label: 'FitnessMetrics', active: false },
  { id: 'patient', label: 'PatientInsights', active: false },
  { id: 'ai', label: 'AI Healthcare', active: false },
]

export function TabNavigation() {
  const [activeTab, setActiveTab] = useState('tracker')

  return (
    <Card className="bg-white p-6 rounded-2xl">
      <div className="flex gap-4 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 -mb-6 pb-3 ${
              activeTab === tab.id
                ? 'text-purple-600 border-purple-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-6 pb-4">
        <p className="text-slate-600 text-sm">Analytics content for {activeTab}</p>
      </div>
    </Card>
  )
}
