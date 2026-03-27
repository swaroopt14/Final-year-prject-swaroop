'use client'

import React from 'react'
import { CardWrapper } from './card-wrapper'
import { AgentTag } from './agent-tag'
import { CheckCircle } from 'lucide-react'

interface InsightProps {
  type: 'critical' | 'diagnosis' | 'state' | 'drug' | 'admin'
  title: string
  description: string
  confidence: number
  agent: 'Doctor' | 'Nurse' | 'Drug' | 'Admin'
  patientId: string
}

const typeStyles = {
  critical: 'bg-red-50 border-red-200',
  diagnosis: 'bg-blue-50 border-blue-200',
  state: 'bg-green-50 border-green-200',
  drug: 'bg-purple-50 border-purple-200',
  admin: 'bg-amber-50 border-amber-200',
}

const typeLabels = {
  critical: 'Critical Alert',
  diagnosis: 'Diagnosis',
  state: 'Patient State',
  drug: 'Drug Intelligence',
  admin: 'Admin Insight',
}

function InsightCard({ type, title, description, confidence, agent, patientId }: InsightProps) {
  return (
    <CardWrapper className={`${typeStyles[type]} border`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs font-semibold text-primary mb-1">{typeLabels[type]}</div>
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <CheckCircle size={16} className="text-primary flex-shrink-0 mt-1" />
      </div>
      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{description}</p>
      <div className="flex items-center justify-between pt-3 border-t border-border/20">
        <div>
          <div className="text-xs text-muted-foreground mb-1">Confidence</div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 bg-border/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-foreground">{confidence}%</span>
          </div>
        </div>
        <div className="text-right">
          <AgentTag agent={agent} size="sm" />
          <div className="text-xs text-muted-foreground mt-1">{patientId}</div>
        </div>
      </div>
    </CardWrapper>
  )
}

export function AIInsights() {
  const insights: InsightProps[] = [
    {
      type: 'critical',
      title: 'Sepsis Indicator Detected',
      description: 'Multiple vital signs indicate potential sepsis. Elevated WBC, fever, and lactate levels detected in P-2847.',
      confidence: 94,
      agent: 'Doctor',
      patientId: 'P-2847',
    },
    {
      type: 'diagnosis',
      title: 'Pneumonia Suspected',
      description: 'Based on X-ray analysis and symptoms. CXR shows infiltrate in lower left lobe consistent with bacterial pneumonia.',
      confidence: 87,
      agent: 'Doctor',
      patientId: 'P-2945',
    },
    {
      type: 'drug',
      title: 'Medication Adjustment Needed',
      description: 'Lisinopril dose too high for current renal function (eGFR 32). Recommend 50% reduction to prevent toxicity.',
      confidence: 91,
      agent: 'Drug',
      patientId: 'P-3001',
    },
    {
      type: 'state',
      title: 'Glucose Level Critical',
      description: 'Blood glucose at 42 mg/dL. Patient requires immediate intervention to prevent seizure and loss of consciousness.',
      confidence: 98,
      agent: 'Nurse',
      patientId: 'P-2756',
    },
    {
      type: 'admin',
      title: 'Resource Allocation Optimized',
      description: 'Recommended transfer of 2 stable patients from ICU to step-down unit. Frees 2 ICU beds for critical cases.',
      confidence: 79,
      agent: 'Admin',
      patientId: 'General',
    },
    {
      type: 'diagnosis',
      title: 'Hypertension Trend',
      description: 'Patient BP elevated for past 4 hours. Recommend checking medication adherence and hydration status.',
      confidence: 76,
      agent: 'Nurse',
      patientId: 'P-2891',
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">AI-Generated Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} {...insight} />
        ))}
      </div>
    </div>
  )
}
