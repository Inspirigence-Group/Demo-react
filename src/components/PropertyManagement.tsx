'use client'

import { useState } from 'react'
import { useStore } from '@/store/use-store'
import { Property } from '@/types'
import { Home, Plus, Search, Filter, MapPin, Edit, Trash2, Camera, Bed, Bath, Square } from 'lucide-react'
import { formatCurrency, getStatusColor } from '@/lib/utils'

export default function PropertyManagement() {
  const { properties, addProperty, updateProperty, deleteProperty } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    const matchesType = typeFilter === 'all' || property.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateProperty = (propertyData: Partial<Property>) => {
    const newProperty: Property = {
      id: Date.now().toString(),
      title: propertyData.title || '',
      type: propertyData.type || 'Appartement',
      location: propertyData.location || '',
      price: propertyData.price || 0,
      area: propertyData.area || 0,
      rooms: propertyData.rooms || 0,
      bedrooms: propertyData.bedrooms || 0,
      bathrooms: propertyData.bathrooms || 0,
      features: propertyData.features || [],
      description: propertyData.description || '',
      images: propertyData.images || [],
      scrapedFrom: 'manual',
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addProperty(newProperty)
    setIsCreating(false)
  }

  const handleUpdateProperty = (id: string, updates: Partial<Property>) => {
    updateProperty(id, updates)
    setEditingProperty(null)
  }

  const handleDeleteProperty = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
      deleteProperty(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Gestion des Biens</h1>
          <p className="text-slate-400">{properties.length} biens au total</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau Bien
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un bien..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="sold">Vendu</option>
            <option value="reserved">Réservé</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="all">Tous les types</option>
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
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="glass rounded-xl overflow-hidden">
            {/* Property Image */}
            <div className="relative h-48 bg-slate-700">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-slate-500" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-slate-400">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingProperty(property)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-slate-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="p-1 hover:bg-slate-700 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-400">
                    {formatCurrency(property.price)}
                  </span>
                  <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                    {property.type}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Square className="w-4 h-4" />
                    {property.area}m²
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Bed className="w-4 h-4" />
                    {property.rooms}p
                  </div>
                  <div className="flex items-center gap-1 text-slate-300">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms || 0}s
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {property.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {property.features.slice(0, 3).map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                    {property.features.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                        +{property.features.length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {property.description && (
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {property.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingProperty) && (
        <PropertyForm
          property={editingProperty}
          onSubmit={(data) => editingProperty ? handleUpdateProperty(editingProperty.id, data) : handleCreateProperty(data)}
          onCancel={() => {
            setIsCreating(false)
            setEditingProperty(null)
          }}
        />
      )}
    </div>
  )
}

// Property Form Component
function PropertyForm({ property, onSubmit, onCancel }: { 
  property: Property | null
  onSubmit: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    type: property?.type || 'Appartement',
    location: property?.location || '',
    price: property?.price || 0,
    area: property?.area || 0,
    rooms: property?.rooms || 0,
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    features: property?.features.join(', ') || '',
    description: property?.description || '',
    images: property?.images.join(', ') || '',
    status: property?.status || 'available'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(f => f),
      images: formData.images.split(',').map(img => img.trim()).filter(img => img)
    }
    
    if (property) {
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
            {property ? 'Modifier le bien' : 'Nouveau bien'}
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
              <label className="block text-sm font-medium text-slate-300 mb-1">Titre</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Localisation</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Prix (MAD)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Surface (m²)</label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({...formData, area: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Pièces</label>
              <input
                type="number"
                required
                value={formData.rooms}
                onChange={(e) => setFormData({...formData, rooms: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Chambres</label>
              <input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">SDB</label>
              <input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Équipements (séparés par des virgules)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              placeholder="parking, terrasse, piscine, jardin, climatisation"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Images (URLs séparées par des virgules)</label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({...formData, images: e.target.value})}
              rows={2}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value as any})}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-green-500"
            >
              <option value="available">Disponible</option>
              <option value="sold">Vendu</option>
              <option value="reserved">Réservé</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {property ? 'Mettre à jour' : 'Créer'}
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
