'use client'

import { useState } from 'react'
import { useStore } from '@/store/use-store'
import { Lead } from '@/types'
import { Users, Plus, Search, Filter, Phone, Mail, Calendar, Edit, Trash2 } from 'lucide-react'
import { formatCurrency, getStatusColor, getInitials } from '@/lib/utils'

export default function LeadManagement() {
  const { leads, addLead, updateLead, deleteLead } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.preferences.location.some(loc => 
                           loc.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateLead = (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: Date.now().toString(),
      name: leadData.name || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      budget: leadData.budget || { min: 0, max: 0 },
      preferences: leadData.preferences || {
        type: 'Appartement',
        location: [],
        features: []
      },
      source: leadData.source || 'website',
      status: 'new',
      notes: leadData.notes || '',
      chatHistory: [],
      aiProfile: leadData.aiProfile || '',
      priority: leadData.priority || 'location',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addLead(newLead)
    setIsCreating(false)
  }

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    updateLead(id, updates)
    setEditingLead(null)
  }

  const handleDeleteLead = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce lead ?')) {
      deleteLead(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gestion des Leads</h1>
          <p className="text-slate-400">{leads.length} leads au total</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveaux</option>
            <option value="contacted">Contactés</option>
            <option value="visiting">Visite</option>
            <option value="negotiating">Négociation</option>
            <option value="closed">Fermés</option>
          </select>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div key={lead.id} className="glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{lead.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingLead(lead)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <Edit className="w-4 h-4 text-slate-400" />
                </button>
                <button
                  onClick={() => handleDeleteLead(lead.id)}
                  className="p-1 hover:bg-slate-700 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="w-4 h-4" />
                {lead.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="w-4 h-4" />
                {lead.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Calendar className="w-4 h-4" />
                {lead.source}
              </div>
              
              <div className="pt-3 border-t border-slate-700">
                <div className="text-sm text-white mb-1">
                  Budget: <span className="text-green-400 font-medium">
                    {formatCurrency(lead.budget.min)} - {formatCurrency(lead.budget.max)}
                  </span>
                </div>
                <div className="text-sm text-white mb-1">
                  Recherche: <span className="text-slate-300">{lead.preferences.type}</span>
                </div>
                <div className="text-sm text-white">
                  Localisation: <span className="text-slate-300">{lead.preferences.location.join(', ')}</span>
                </div>
              </div>
              
              {lead.notes && (
                <div className="pt-3 border-t border-slate-700">
                  <p className="text-xs text-slate-400">{lead.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingLead) && (
        <LeadForm
          lead={editingLead}
          onSubmit={(data) => editingLead ? handleUpdateLead(editingLead.id, data) : handleCreateLead(data)}
          onCancel={() => {
            setIsCreating(false)
            setEditingLead(null)
          }}
        />
      )}
    </div>
  )
}

// Lead Form Component
function LeadForm({ lead, onSubmit, onCancel }: { 
  lead: Lead | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    budgetMin: lead?.budget.min || 0,
    budgetMax: lead?.budget.max || 0,
    type: lead?.preferences.type || 'Appartement',
    location: lead?.preferences.location.join(', ') || '',
    features: lead?.preferences.features.join(', ') || '',
    source: lead?.source || 'website',
    notes: lead?.notes || '',
    aiProfile: lead?.aiProfile || '',
    priority: lead?.priority || 'location'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      budget: {
        min: formData.budgetMin,
        max: formData.budgetMax
      },
      preferences: {
        type: formData.type,
        location: formData.location.split(',').map(l => l.trim()).filter(l => l),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      }
    }
    
    if (lead) {
      onSubmit(data)
    } else {
      onSubmit(data)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {lead ? 'Modifier le lead' : 'Nouveau lead'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({...formData, source: e.target.value as any})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="website">Site web</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="phone">Téléphone</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Budget min (MAD)</label>
              <input
                type="number"
                required
                value={formData.budgetMin}
                onChange={(e) => setFormData({...formData, budgetMin: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Budget max (MAD)</label>
              <input
                type="number"
                required
                value={formData.budgetMax}
                onChange={(e) => setFormData({...formData, budgetMax: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type de bien</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Studio">Studio</option>
                <option value="F1">F1</option>
                <option value="F2">F2</option>
                <option value="F3">F3</option>
                <option value="F4">F4</option>
                <option value="F5">F5</option>
                <option value="Villa">Villa</option>
                <option value="Riad">Riad</option>
                <option value="Appartement">Appartement</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Localisations (séparées par des virgules)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Maarif, Anfa, Gauthier"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Équipements souhaités (séparés par des virgules)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="parking, terrasse, piscine, jardin"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Profil IA</label>
            <textarea
              value={formData.aiProfile}
              onChange={(e) => setFormData({...formData, aiProfile: e.target.value})}
              rows={2}
              placeholder="Description du profil client pour l'IA..."
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Priorité</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="location">Localisation</option>
              <option value="price">Prix</option>
              <option value="space">Espace</option>
              <option value="features">Équipements</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {lead ? 'Mettre à jour' : 'Créer'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
