'use client'

import React from 'react'
import { CardWrapper } from './card-wrapper'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const vitalsData = [
  { time: '00:00', hr: 72, bp: 120, spo2: 98 },
  { time: '04:00', hr: 68, bp: 115, spo2: 97 },
  { time: '08:00', hr: 75, bp: 125, spo2: 99 },
  { time: '12:00', hr: 80, bp: 130, spo2: 98 },
  { time: '16:00', hr: 82, bp: 135, spo2: 97 },
  { time: '20:00', hr: 78, bp: 128, spo2: 99 },
  { time: '24:00', hr: 72, bp: 122, spo2: 98 },
]

const riskData = [
  { hour: '00:00', riskScore: 35 },
  { hour: '04:00', riskScore: 38 },
  { hour: '08:00', riskScore: 42 },
  { hour: '12:00', riskScore: 55 },
  { hour: '16:00', riskScore: 68 },
  { hour: '20:00', riskScore: 72 },
  { hour: '24:00', riskScore: 65 },
]

const hospitalLoadData = [
  { time: '00:00', occupied: 45, available: 15 },
  { time: '06:00', occupied: 52, available: 8 },
  { time: '12:00', occupied: 58, available: 2 },
  { time: '18:00', occupied: 55, available: 5 },
  { time: '24:00', occupied: 48, available: 12 },
]

const drugInteractionData = [
  { drug: 'Metformin', conflicts: 4 },
  { drug: 'Lisinopril', conflicts: 3 },
  { drug: 'Aspirin', conflicts: 2 },
  { drug: 'Warfarin', conflicts: 6 },
  { drug: 'Amlodipine', conflicts: 2 },
]

export function GraphsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
      <CardWrapper>
        <h3 className="text-sm font-semibold text-foreground mb-4">Vital Signs Monitoring</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={vitalsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E8EAED' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="hr"
              stroke="#EF4444"
              name="Heart Rate"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="bp"
              stroke="#3B82F6"
              name="Blood Pressure"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="spo2"
              stroke="#10B981"
              name="SpO2 %"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardWrapper>

      <CardWrapper>
        <h3 className="text-sm font-semibold text-foreground mb-4">Risk Score Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={riskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="hour" stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E8EAED' }}
            />
            <Line
              type="monotone"
              dataKey="riskScore"
              stroke="#F59E0B"
              name="Risk Score"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardWrapper>

      <CardWrapper>
        <h3 className="text-sm font-semibold text-foreground mb-4">Hospital Bed Capacity</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={hospitalLoadData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="time" stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E8EAED' }}
            />
            <Legend />
            <Bar dataKey="occupied" stackId="a" fill="#EF4444" name="Occupied" />
            <Bar dataKey="available" stackId="a" fill="#10B981" name="Available" />
          </BarChart>
        </ResponsiveContainer>
      </CardWrapper>

      <CardWrapper>
        <h3 className="text-sm font-semibold text-foreground mb-4">Drug Interaction Frequency</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={drugInteractionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="drug" stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #1E293B',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E8EAED' }}
            />
            <Bar dataKey="conflicts" fill="#8B5CF6" name="Conflicts" />
          </BarChart>
        </ResponsiveContainer>
      </CardWrapper>
    </div>
  )
}
