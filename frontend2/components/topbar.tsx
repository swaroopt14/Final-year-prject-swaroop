'use client'

import React from 'react'
import { Search, Bell, Settings, ChevronDown } from 'lucide-react'

export function Topbar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40 flex items-center justify-between px-6 gap-4">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients, alerts..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Alerts */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} className="text-gray-600 hover:text-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Settings */}
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings size={20} className="text-gray-600 hover:text-foreground" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center text-sm font-semibold text-primary">
            AU
          </div>
          <span className="text-sm text-foreground">Admin</span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}
