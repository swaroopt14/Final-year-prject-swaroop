import { Card } from '@/components/ui/card'

export function AppointmentCards() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Dental Checkup Card */}
      <Card className="bg-white p-4 rounded-xl hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-lg">👨‍⚕️</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Dental Checkup</h4>
            <p className="text-xs text-slate-600">Dr. Jane Cooper</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
          </svg>
          Appointment On Apr 16, 10:20am
        </div>
      </Card>

      {/* Cancer Screening Card */}
      <Card className="bg-white p-4 rounded-xl hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
            <span className="text-lg">👩‍⚕️</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Cancer Screening</h4>
            <p className="text-xs text-slate-600">Dr. Cameron Williamson</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
          </svg>
          Appointment On Apr 28, 02:40am
        </div>
      </Card>
    </div>
  )
}
