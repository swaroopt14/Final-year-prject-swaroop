'use client'

import React, { useState } from 'react'
import { CardWrapper } from './card-wrapper'
import { AgentTag } from './agent-tag'
import { AlertBadge } from './alert-badge'
import { ChevronDown } from 'lucide-react'

interface PatientRow {
  id: string
  name: string
  age: number
  status: 'stable' | 'warning' | 'critical'
  riskScore: number
  lastUpdated: string
  agent: 'Doctor' | 'Nurse' | 'Drug' | 'Admin'
}

const statusStyles = {
  stable: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  critical: 'bg-red-50 text-red-700',
}

const statusBadges = {
  stable: 'info' as const,
  warning: 'warning' as const,
  critical: 'critical' as const,
}

const statusText = {
  stable: 'Stable',
  warning: 'Warning',
  critical: 'Critical',
}

export function PatientTable() {
  const [sortBy, setSortBy] = useState<'name' | 'risk'>('risk')

  const patients: PatientRow[] = [
    {
      id: 'P-2847',
      name: 'John Murphy',
      age: 68,
      status: 'critical',
      riskScore: 92,
      lastUpdated: '2 mins',
      agent: 'Doctor',
    },
    {
      id: 'P-2945',
      name: 'Sarah Johnson',
      age: 55,
      status: 'warning',
      riskScore: 68,
      lastUpdated: '5 mins',
      agent: 'Nurse',
    },
    {
      id: 'P-3001',
      name: 'Michael Chen',
      age: 72,
      status: 'critical',
      riskScore: 85,
      lastUpdated: '1 min',
      agent: 'Drug',
    },
    {
      id: 'P-2756',
      name: 'Emma Rodriguez',
      age: 45,
      status: 'warning',
      riskScore: 54,
      lastUpdated: '8 mins',
      agent: 'Nurse',
    },
    {
      id: 'P-2891',
      name: 'James Wilson',
      age: 62,
      status: 'stable',
      riskScore: 28,
      lastUpdated: '12 mins',
      agent: 'Doctor',
    },
    {
      id: 'P-2734',
      name: 'Lisa Anderson',
      age: 58,
      status: 'stable',
      riskScore: 32,
      lastUpdated: '15 mins',
      agent: 'Nurse',
    },
  ]

  const sorted = [...patients].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore
    return a.name.localeCompare(b.name)
  })

  return (
    <CardWrapper className="col-span-3 bg-white border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Patient Overview</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('risk')}
            className={`text-xs px-3 py-1 rounded-lg transition-colors font-medium ${
              sortBy === 'risk'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Risk Score
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`text-xs px-3 py-1 rounded-lg transition-colors font-medium ${
              sortBy === 'name'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Name
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold">Patient</th>
              <th className="text-left py-3 px-4 font-semibold">Age</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Risk Score</th>
              <th className="text-left py-3 px-4 font-semibold">Updated</th>
              <th className="text-left py-3 px-4 font-semibold">Agent</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((patient) => (
              <tr
                key={patient.id}
                className={`
                  border-b border-gray-100 transition-colors hover:bg-gray-50
                  ${patient.status === 'critical' && 'bg-red-50'}
                  ${patient.status === 'warning' && 'bg-yellow-50'}
                `}
              >
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{patient.name}</span>
                    <span className="text-xs text-gray-500">{patient.id}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">{patient.age}</td>
                <td className="py-3 px-4 text-sm">
                  <AlertBadge
                    severity={statusBadges[patient.status]}
                    text={statusText[patient.status]}
                  />
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{patient.riskScore}</span>
                    <div className="w-16 h-1 bg-border/40 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          patient.riskScore > 80
                            ? 'bg-red-500'
                            : patient.riskScore > 50
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{ width: `${patient.riskScore}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {patient.lastUpdated}
                </td>
                <td className="py-3 px-4">
                  <AgentTag agent={patient.agent} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardWrapper>
  )
}
