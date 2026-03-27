import { Card } from '@/components/ui/card'

export function WellnessMetrics() {
  return (
    <div className="space-y-4">
      {/* Main BPM Card */}
      <Card className="bg-white p-6 rounded-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-slate-600 mb-1">12/02</p>
            <div className="text-4xl font-bold text-purple-600">89</div>
            <p className="text-sm text-slate-600 mt-1">bpm</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-600 font-medium mb-1">PERFECTION WELLNESS METRICS</p>
            <p className="text-xs text-slate-600">BASED ON BIOCHEMISTRY</p>
            <p className="text-xs text-slate-600 mt-2">±3.2% from last week</p>
          </div>
        </div>
      </Card>

      {/* Two Column Metrics */}
      <div className="grid grid-cols-2 gap-4">
        {/* Wellness Metrics */}
        <Card className="bg-white p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-600 mb-1">Perfection Wellness Metrics</p>
              <p className="text-xs text-slate-600 text-xs">Based On Biochemistry</p>
              <div className="text-3xl font-bold text-slate-900 mt-2">265</div>
              <p className="text-xs text-slate-600 mt-1">KCAL</p>
            </div>
            <div className="w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Heart icon */}
                <path d="M50 90 C 25 75 10 60 10 45 C 10 30 20 20 30 20 C 40 20 50 30 50 30 C 50 30 60 20 70 20 C 80 20 90 30 90 45 C 90 60 75 75 50 90 Z" 
                  fill="#EF4444" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </Card>

        {/* Calories Burned */}
        <Card className="bg-white p-4 rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-slate-600 mb-1">Calory Burned</p>
              <p className="text-xs text-slate-600">Workouts Completed</p>
              <div className="text-3xl font-bold text-slate-900 mt-2">175</div>
              <p className="text-xs text-slate-600 mt-1">QAL</p>
            </div>
            <div className="w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Lungs icon */}
                <ellipse cx="35" cy="50" rx="15" ry="25" fill="#3B82F6" opacity="0.3"/>
                <ellipse cx="65" cy="50" rx="15" ry="25" fill="#3B82F6" opacity="0.3"/>
                <path d="M50 40 L50 70" stroke="#3B82F6" strokeWidth="2" fill="none" opacity="0.3"/>
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
