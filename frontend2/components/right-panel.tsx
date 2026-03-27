import { Card } from '@/components/ui/card'
import { CheckupHistory } from './checkup-history'
import { AppointmentCards } from './appointment-cards'
import { CheckupSchedule } from './checkup-schedule'
import { WellnessMetrics } from './wellness-metrics'

export function RightPanel() {
  return (
    <div className="w-96 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
      {/* Medical Checkup History */}
      <CheckupHistory />

      {/* Appointment Cards */}
      <AppointmentCards />

      {/* Checkup Schedule */}
      <CheckupSchedule />

      {/* Wellness Metrics */}
      <WellnessMetrics />
    </div>
  )
}
