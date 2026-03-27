import { Heart, Clock, Check, Heart as HeartIcon, Settings, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <div className="border-2 border-purple-600 rounded-full px-6 py-2 font-bold text-purple-600">
          MEDICO
        </div>

        {/* Nav Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <Heart className="w-5 h-5 text-purple-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <Clock className="w-5 h-5 text-slate-400" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg">
            <Check className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-slate-100 rounded-lg">
          <HeartIcon className="w-5 h-5 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg">
          <Settings className="w-5 h-5 text-slate-600" />
        </button>
        <button className="p-2 hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5 text-slate-600" />
        </button>
        <span className="text-sm text-slate-600">Sat, 26 Aug</span>
        <button className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
          <span className="text-lg">≡</span>
        </button>
      </div>
    </header>
  )
}
