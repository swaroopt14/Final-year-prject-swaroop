import { Card } from '@/components/ui/card'

const dates = [
  { day: 'Thu', date: 15 },
  { day: 'Thu', date: 15 },
  { day: 'Fri', date: 16 },
  { day: 'Sat', date: 17 },
  { day: 'Sun', date: 18 },
  { day: 'Mon', date: 20, active: true },
  { day: 'Tue', date: 20 },
  { day: 'Wed', date: 21 },
  { day: 'Thu', date: 22 },
]

export function CheckupSchedule() {
  return (
    <Card className="bg-white p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Checkup Schedule</h3>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          Show More
        </button>
      </div>

      <div className="grid grid-cols-9 gap-2">
        {dates.map((item, idx) => (
          <button
            key={idx}
            className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
              item.active
                ? 'bg-purple-600 text-white'
                : 'hover:bg-slate-100'
            }`}
          >
            <span className={`text-xs font-medium ${item.active ? 'text-white' : 'text-slate-600'}`}>
              {item.day}
            </span>
            <span className={`text-lg font-bold ${item.active ? 'text-white' : 'text-slate-900'}`}>
              {item.date}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
