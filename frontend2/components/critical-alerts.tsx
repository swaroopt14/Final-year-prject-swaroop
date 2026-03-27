'use client'

import React from 'react'
import { CardWrapper } from './card-wrapper'
import { AgentTag } from './agent-tag'
import { AlertTriangle } from 'lucide-react'

interface AlertProps {
  title: string
  description: string
  patientId: string
  agent: 'Doctor' | 'Nurse' | 'Drug' | 'Admin'
  timestamp: string
}

function AlertCard({ title, description, patientId, agent, timestamp }: AlertProps) {
  return (
    <CardWrapper glow className="flex-shrink-0 w-80 border-2 border-red-400 bg-red-50">
      <div className="flex items-start gap-3 mb-3">
        <div className="text-red-700 flex-shrink-0 mt-0.5">
          <AlertTriangle size={22} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-red-900">{title}</h3>
          <p className="text-xs text-red-700 mt-1 font-medium">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-red-300">
        <div className="text-xs text-red-700">
          <div className="font-bold">Patient ID: {patientId}</div>
          <div className="mt-1 text-red-600 font-medium">{timestamp}</div>
        </div>
        <AgentTag agent={agent} size="sm" />
      </div>
    </CardWrapper>
  )
}

export function CriticalAlerts() {
  const alerts = [
    {
      title: 'Sepsis Risk Detected',
      description: 'Patient showing elevated WBC and fever markers',
      patientId: 'P-2847',
      agent: 'Doctor' as const,
      timestamp: '2 mins ago',
    },
    {
      title: 'O2 Saturation Low',
      description: 'SpO2 dropped to 88%, monitoring required',
      patientId: 'P-2945',
      agent: 'Nurse' as const,
      timestamp: '5 mins ago',
    },
    {
      title: 'Drug Interaction Detected',
      description: 'Metformin + Lisinopril contraindication found',
      patientId: 'P-3001',
      agent: 'Drug' as const,
      timestamp: '8 mins ago',
    },
    {
      title: 'Bed Pressure Ulcer Risk',
      description: 'Patient immobile for 6+ hours, high risk',
      patientId: 'P-2756',
      agent: 'Nurse' as const,
      timestamp: '12 mins ago',
    },
  ]

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {alerts.map((alert, idx) => (
        <AlertCard key={idx} {...alert} />
      ))}
    </div>
  )
}
