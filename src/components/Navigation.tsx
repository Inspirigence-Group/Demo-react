'use client'

import { Users, Home, Target, BarChart3, Settings } from 'lucide-react'

interface NavigationProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'properties', label: 'Properties', icon: Home },
  { id: 'matching', label: 'Matching IA', icon: Target },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
