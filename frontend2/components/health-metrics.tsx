import { Card } from '@/components/ui/card'

export function HealthMetrics() {
  return (
    <div className="space-y-4">
      {/* HRV Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v8H3zm4-8h2v16H7zm4-2h2v18h-2zm4 4h2v14h-2zm4-1h2v15h-2z" opacity="0.5"/>
          </svg>
          <span className="text-sm opacity-90">HRV</span>
        </div>
        <div className="text-3xl font-bold mb-1">84 ms</div>
        <div className="text-sm opacity-90">Stable</div>
      </Card>

      {/* Cholesterol Card */}
      <Card className="bg-white border border-slate-200 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="8" r="3"/>
            <path d="M12 11c3 0 9 1 9 6v5h-18v-5c0-5 6-6 9-6z"/>
          </svg>
          <span className="text-sm text-slate-600">Cholesterol</span>
        </div>
        <div className="text-2xl font-bold text-slate-900">166 <span className="text-sm text-slate-500 font-normal">mg/dl</span></div>
      </Card>

      {/* Blood Pressure Card */}
      <Card className="bg-white border border-slate-200 p-4 rounded-lg">
        <div className="text-sm text-slate-600 mb-2">Blood Pressure</div>
        <div className="text-2xl font-bold text-slate-900">120/80</div>
      </Card>
    </div>
  )
}
