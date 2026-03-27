'use client'

import { Card } from '@/components/ui/card'

export function AnalyticsChart() {
  const data = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 30 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 25 },
    { month: 'May', value: 35 },
    { month: 'Jun', value: 40 },
    { month: 'Jul', value: 80 },
  ]

  const maxValue = 100

  return (
    <Card className="bg-white p-8 rounded-2xl">
      <div className="grid grid-cols-2 gap-8">
        {/* Left - Tracker Metrics */}
        <div className="space-y-8">
          <div>
            <div className="text-sm text-slate-600 mb-2">Tracker</div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-900">09.45</span>
              <span className="text-sm text-slate-500">AM</span>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">+2.3min</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-slate-900">98.57<span className="text-lg">°</span></span>
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">+5min</span>
            </div>
          </div>
        </div>

        {/* Right - Bar Chart */}
        <div className="flex items-flex-end justify-center gap-2 h-48">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center justify-end h-40">
                <div
                  className={`w-6 rounded-t-lg transition-all ${
                    idx === 2 || idx === 6 
                      ? 'bg-purple-600 h-32' 
                      : 'bg-slate-200 h-12'
                  }`}
                ></div>
              </div>
              <span className="text-xs text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Y-axis labels */}
      <div className="flex justify-end mt-4 gap-8 pr-12">
        <div className="text-right text-xs text-slate-500">
          <div>10%</div>
          <div className="mt-4">08%</div>
          <div className="mt-4">06%</div>
        </div>
      </div>
    </Card>
  )
}
