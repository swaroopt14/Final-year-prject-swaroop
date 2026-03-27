import { Card } from '@/components/ui/card'

const historyData = [
  { category: 'Running', date: '20 April, 2024', duration: '120 Minutes', calories: '140 Calory Burned', icon: '🏃' },
  { category: 'Cycling', date: '18 April, 2024', duration: '120 Minutes', calories: '140 Calory Burned', icon: '🚴' },
  { category: 'Swimming', date: '16 April, 2024', duration: '120 Minutes', calories: '140 Calory Burned', icon: '🏊' },
  { category: 'Yoga', date: '10 April, 2024', duration: '120 Minutes', calories: '140 Calory Burned', icon: '🧘' },
  { category: 'Cycling', date: '18 April, 2024', duration: '120 Minutes', calories: '140 Calory Burned', icon: '🚴' },
]

export function CheckupHistory() {
  return (
    <Card className="bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Medical Checkup History</h3>
        <button className="text-slate-600 hover:text-slate-900">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 12h14m-7-7v14" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </button>
      </div>

      <div className="space-y-2">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-2 pb-3 border-b border-slate-200">
          <div className="text-xs font-semibold text-slate-600">Category</div>
          <div className="text-xs font-semibold text-slate-600">Date</div>
          <div className="text-xs font-semibold text-slate-600">Duration</div>
          <div className="text-xs font-semibold text-slate-600">Calory Burned</div>
        </div>

        {/* Data Rows */}
        {historyData.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="text-slate-900">{item.category}</span>
            </div>
            <div className="text-slate-600">{item.date}</div>
            <div className="text-slate-600">{item.duration}</div>
            <div className="text-slate-600">{item.calories}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
