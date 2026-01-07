'use client'

import { useStore } from '@/store/use-store'
import { Users, Home, Target, TrendingUp, Clock, MapPin } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const { leads, properties, stats } = useStore()

  const recentLeads = leads.slice(0, 3)
  const recentProperties = properties.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of your real estate business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{leads.length}</div>
          <div className="text-sm text-slate-400">Active Leads</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-xs text-slate-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{properties.length}</div>
          <div className="text-sm text-slate-400">Properties</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-slate-400">Active</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.activeMatches || 0}</div>
          <div className="text-sm text-slate-400">Matches</div>
        </div>

        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xs text-slate-400">Rate</span>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats?.conversionRate || 0}%</div>
          <div className="text-sm text-slate-400">Conversion</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Leads</h2>
            <Users className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{lead.name}</div>
                    <div className="text-xs text-slate-400">{lead.preferences.type} • {lead.preferences.location.join(', ')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-400">
                    {formatCurrency(lead.budget.min)}
                  </div>
                  <div className="text-xs text-slate-400">{lead.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Properties */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Properties</h2>
            <Home className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentProperties.map((property) => (
              <div key={property.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {property.type[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{property.title}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {property.location} • {property.area}m²
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-400">
                    {formatCurrency(property.price)}
                  </div>
                  <div className="text-xs text-slate-400">{property.rooms} pièces</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Avg Response Time</div>
              <div className="text-xs text-slate-400">{stats?.avgResponseTime || 0} hours</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Top Locations</div>
              <div className="text-xs text-slate-400">
                {stats?.topLocations?.slice(0, 2).join(', ') || 'N/A'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Match Success Rate</div>
              <div className="text-xs text-slate-400">87.3% this month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
