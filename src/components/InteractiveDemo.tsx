'use client'

import { useState, useEffect } from 'react'
import { MatchingEngine } from '@/lib/matching-engine'
import { Lead, Property, MatchResult } from '@/types'
import { useStore } from '@/store/use-store'
import { 
  Brain, Plus, Send, FileText, FileCheck, BadgeCheck, Check, Clock, 
  Zap, Eye, Download, UserPlus, Image, MapPin, Home, Star, TrendingUp
} from 'lucide-react'
import { formatCurrency, getScoreColor, getScoreBgColor } from '@/lib/utils'
import DocumentModal from './DocumentModal'
import { tildaIntegration } from '@/lib/tilda-integration'

export default function InteractiveDemo() {
  const { leads, properties, selectedLead, setSelectedLead, addLead, addProperty, initializeDemoData, canCreateLead, maxAdditionalLeads, additionalLeadsCreated, phoneNumbers, addPhoneNumber } = useStore()
  const [matchingEngine] = useState(() => new MatchingEngine())
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [isMatching, setIsMatching] = useState(false)
  const [brochureGenerated, setBrochureGenerated] = useState(false)
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<{
    title: string
    url: string
    type: string
  } | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [showProPopup, setShowProPopup] = useState(false)
  const [savedNumbers, setSavedNumbers] = useState<string[]>([])
  const [isCreatingLead, setIsCreatingLead] = useState(false)

  useEffect(() => {
    // Initialize demo data on component mount
    initializeDemoData()
  }, [initializeDemoData])

  useEffect(() => {
    // Update saved numbers when they change in the store
    setSavedNumbers(phoneNumbers)
  }, [phoneNumbers])

  useEffect(() => {
    if (selectedLead && properties.length > 0) {
      performMatching(selectedLead.id)
    }
  }, [selectedLead, properties])

  const performMatching = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    setIsMatching(true)
    setCurrentStep(2)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const matchResults = matchingEngine.findBestMatches(lead, properties)
    setMatches(matchResults)
    setIsMatching(false)
    setCurrentStep(3)
  }

  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead)
    setCurrentStep(2)
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property)
    setBrochureGenerated(true)
    setCurrentStep(4)
  }

  const handleSendBrochure = async () => {
    if (!firstName.trim()) {
      alert('Veuillez saisir votre prénom')
      return
    }
    
    if (!phoneNumber.trim()) {
      alert('Veuillez saisir un numéro de téléphone')
      return
    }
    
    setIsCreatingLead(true)
    
    try {
      // 1. Enregistrer le numéro de téléphone dans le store
      addPhoneNumber(phoneNumber)
      
      // 2. Mettre à jour la liste locale des numéros sauvegardés
      setSavedNumbers(prev => [...prev, phoneNumber])
      
      // 3. Créer un lead dans Tilda
      const tildaResult = await tildaIntegration.createLead({
        name: firstName,
        phone: phoneNumber,
        email: selectedLead?.email,
        formname: 'RealtyMatch Brochure Request',
        // Ajouter des informations sur le bien sélectionné
        propertyTitle: selectedProperty?.title,
        propertyPrice: selectedProperty?.price,
        propertyLocation: selectedProperty?.location,
        source: 'realty-match-demo'
      })
      
      // 4. Afficher le résultat
      if (tildaResult.success) {
        alert(`✅ Brochure envoyée via WhatsApp au ${phoneNumber}!\n\n🎯 Lead Tilda créé avec succès!\nID: ${tildaResult.leadId}\n\nNuméro enregistré avec succès.`)
      } else {
        alert(`⚠️ Brochure envoyée via WhatsApp au ${phoneNumber}!\n\n❌ Erreur lors de la création du lead Tilda:\n${tildaResult.message}\n\nLe numéro a été enregistré localement.`)
      }
      
      // 5. Vider les champs après envoi
      setPhoneNumber('')
      setFirstName('')
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      alert(`❌ Erreur technique lors de l'envoi. Veuillez réessayer.\n\nLe numéro ${phoneNumber} a été enregistré localement.`)
    } finally {
      setIsCreatingLead(false)
    }
  }

  const handleDocumentClick = (title: string, filename: string) => {
    setSelectedDocument({
      title,
      url: `/documents/${filename}.html`,
      type: 'Document Officiel'
    })
    setIsDocumentModalOpen(true)
  }

  const handleCloseDocumentModal = () => {
    setIsDocumentModalOpen(false)
    setSelectedDocument(null)
  }

  const handleImportQuick = (platform: string) => {
    setShowProPopup(true)
  }

  const handleImportLead = () => {
    if (!canCreateLead()) {
      alert('Limite de création de leads atteinte! Vous ne pouvez créer que 3 leads supplémentaires.');
      return;
    }

    const newLead: Lead = {
      id: Date.now().toString(),
      name: 'Nouveau Lead',
      email: 'nouveau@example.com',
      phone: '+212600000000',
      budget: { min: 1000000, max: 3000000 },
      preferences: {
        type: 'Appartement',
        location: ['Casablanca'],
        features: ['parking']
      },
      source: 'website',
      status: 'new',
      notes: '',
      chatHistory: [],
      aiProfile: '',
      priority: 'location',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addLead(newLead)
  }

  const handleImportProperty = () => {
    const newProperty: Property = {
      id: Date.now().toString(),
      title: 'Nouveau Bien',
      type: 'Appartement',
      location: 'Casablanca',
      price: 2000000,
      area: 120,
      rooms: 3,
      features: ['parking', 'terrasse'],
      description: 'Magnifique appartement',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format'],
      status: 'available',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    addProperty(newProperty)
  }

  const handleSimulateRelance = () => {
    // Find all timeline items in the WhatsApp Automation section
    const timelineContainer = Array.from(document.querySelectorAll('div')).find(el => {
      const label = el.querySelector('label')
      return label?.textContent?.includes('Vivez l\'expérience (en accéléré)')
    })
    
    if (!timelineContainer) {
      console.error('Timeline WhatsApp container non trouvé')
      alert('Timeline WhatsApp non trouvée')
      return
    }
    
    // Get the timeline items (the divs with the timeline content)
    const timelineItems = timelineContainer.querySelectorAll('.space-y-2 > div')
    console.log('Timeline items found:', timelineItems.length)
    
    if (timelineItems.length === 0) {
      console.error('No timeline items found in container')
      alert('Aucun élément de timeline trouvé')
      return
    }
    
    let completed = 1 // Start from 1 since first item is already completed
    
    const interval = setInterval(() => {
      if (completed >= timelineItems.length) {
        clearInterval(interval)
        // Show completion notification
        alert('Automation WhatsApp complétée avec IA !')
        
                return
      }
      
      const item = timelineItems[completed] as HTMLElement
      item.classList.remove('opacity-50')
      const icon = item.querySelector('.w-6') as HTMLElement
      if (icon) {
        icon.classList.remove('bg-white/10')
        icon.classList.add('bg-green-500')
        
        // Replace clock icon with check icon
        const clockIcon = icon.querySelector('.lucide-clock')
        if (clockIcon) {
          clockIcon.classList.remove('lucide-clock')
          clockIcon.classList.add('lucide-check')
        }
        
        // Update the text content to show completion
        const textElements = item.querySelectorAll('.text-xs')
        textElements.forEach(el => {
          if (el.textContent?.includes('J2') || el.textContent?.includes('J4')) {
            el.classList.remove('text-white/50')
            el.classList.add('text-white/80')
          }
          if (el.textContent?.includes('IA Analysis') || el.textContent?.includes('Smart Content')) {
            el.classList.remove('text-white/30')
            el.classList.add('text-white/40')
          }
        })
      }
      
      completed++
    }, 800)
  }

  const stepLabels = ['Import', 'Matching IA', 'Brochure', 'Automatisation']
  const stepProgress = [25, 50, 75, 100]

  return (
    <div className="min-h-screen bg-gradient-to-b from-kommo-dark to-[#1a1840] relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <Zap className="w-4 h-4 text-kommo-primary" />
            <span className="text-sm font-medium text-kommo-primary">Démo interactive - RealtyMatch par Kommo Maroc</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Testez l'expérience en 45 secondes
            <br />
            Automatisez 90% de votre travail administratif
          </h2>
          <p className="text-lg text-white/60">
            Choisissez un lead → Voyez le matching → Générez une brochure → Simulez l'envoi
          </p>
        </div>

        {/* Interactive Demo Widget */}
        <div className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          {/* Progress Bar */}
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-white/80">Progression</span>
              <span className="text-xs text-white/40">Étape {currentStep} sur 4</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full progress-bar rounded-full transition-all duration-500" 
                style={{ width: `${stepProgress[currentStep - 1]}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              {stepLabels.map((label, index) => (
                <span 
                  key={label}
                  className={`text-xs ${
                    index + 1 <= currentStep ? 'text-kommo-primary' : 'text-white/40'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row min-h-[500px] lg:min-h-[550px]">
            {/* Panel A: Leads & Import <br/> Source de donnée : Kommo */}
            <div className="lg:w-1/4 border-r border-white/10 p-4 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Leads & Import <br/> Source de donnée : Kommo</h3>
                <span className="px-2 py-0.5 bg-kommo-primary/20 text-kommo-primary text-xs font-medium rounded-full">
                  {leads.length}
                </span>
              </div>
              
              {/* Quick Import Section */}
              <div className="mb-4">
                <label className="text-xs font-medium text-white/50 mb-2 block">Import Rapide</label>
                <div className="grid grid-cols-3 gap-1">
                  <button onClick={() => handleImportQuick('Mubawab')} className="py-2 px-1 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 rounded-lg transition-all flex flex-col items-center gap-1">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaXq1z9J_jbq9IL3rtge-ux6tMWkDEzjpOOg&s" alt="Mubawab" className="w-4 h-4 object-contain rounded-md" />
                    <span className="text-xs text-white/70">Mubawab</span>
                  </button>
                  <button onClick={() => handleImportQuick('Avito')} className="py-2 px-1 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 rounded-lg transition-all flex flex-col items-center gap-1">
                    <img src="https://media.licdn.com/dms/image/v2/C560BAQGQ5S6W_8uNAw/company-logo_200_200/company-logo_200_200/0/1630668105641/avitomaroc_logo?e=2147483647&v=beta&t=p3gjfbogjUNTKt41uH1Luu7UDcgrrSRpDvkWm-_u0FQ" alt="Avito" className="w-4 h-4 object-contain rounded-md" />
                    <span className="text-xs text-white/70">Avito</span>
                  </button>
                  <button onClick={() => handleImportQuick('Sarouty')} className="py-2 px-1 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/30 rounded-lg transition-all flex flex-col items-center gap-1">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_6Y1T---8gqPlK0ajFaLGN8W9p7o-0g7QeQ&s" alt="Sarouty" className="w-4 h-4 object-contain rounded-md" />
                    <span className="text-xs text-white/70">Sarouty</span>
                  </button>
                </div>
              </div>
              
              {/* Leads List */}
              <div className="space-y-3">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => handleLeadSelect(lead)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedLead?.id === lead.id
                        ? 'bg-kommo-primary/20 border border-kommo-primary/30'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white truncate">
                        {lead.name}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 text-white text-xs rounded-full">
                        {lead.source}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 truncate">
                      {lead.preferences.type} • {lead.preferences.location.join(', ')}
                    </div>
                    <div className="text-xs text-kommo-accent font-medium">
                      {formatCurrency(lead.budget.max)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                {(() => {
                  const remainingLeads = maxAdditionalLeads - additionalLeadsCreated;
                  return (
                    <button 
                      onClick={handleImportLead}
                      disabled={!canCreateLead()}
                      className={`w-full py-2.5 px-4 border rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        canCreateLead() 
                          ? 'border-dashed border-white/20 text-white/50 hover:border-kommo-primary hover:text-kommo-primary hover:bg-kommo-primary/10' 
                          : 'border-gray-600 text-gray-500 cursor-not-allowed bg-gray-800/50'
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      {canCreateLead() 
                        ? `Créer un lead (${remainingLeads} restants)` 
                        : 'Limite atteinte (3/3)'
                      }
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Panel B: Matching IA & Properties */}
            <div className="lg:w-1/2 p-4 border-r border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Matching Intelligent + IA</h3>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    IA Activée
                  </div>
                  <button 
                    onClick={handleImportProperty}
                    className="flex items-center gap-1 px-3 py-1.5 bg-kommo-primary text-white text-xs font-medium rounded-lg hover:bg-kommo-secondary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Importer annonce
                  </button>
                </div>
              </div>

              {/* Selected Lead Info */}
              {selectedLead && (
                <div className="p-3 bg-kommo-primary/10 rounded-xl mb-4 border border-kommo-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-kommo-primary to-kommo-secondary flex items-center justify-center text-white font-semibold text-sm">
                      {selectedLead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{selectedLead.name}</div>
                      <div className="text-xs text-white/50">
                        {selectedLead.preferences.type} • {selectedLead.preferences.location.join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/40">Budget</div>
                      <div className="text-sm font-semibold text-kommo-accent">
                        {formatCurrency(selectedLead.budget.max)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!selectedLead && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-sm text-white/40 mb-2">Sélectionnez un lead pour activer le matching IA</p>
                  <p className="text-xs text-white/30">L'IA analysera le budget, les critères et les conversations passées</p>
                </div>
              )}

              {/* Matched Properties */}
              {selectedLead && !isMatching && matches.length > 0 && (
                <div className="space-y-3">
                  {matches.map((match, index) => (
                    <div
                      key={`${match.property.id}-${index}`}
                      onClick={() => handlePropertySelect(match.property)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProperty?.id === match.property.id
                          ? 'bg-kommo-primary/20 border border-kommo-primary/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {match.property.images.length > 0 ? (
                            <img
                              src={match.property.images[0]}
                              alt={match.property.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-medium text-white truncate">
                              {match.property.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className={`text-xs font-bold ${getScoreColor(match.aiScore)}`}>
                                {match.aiScore}%
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-white/60 mb-1">
                            {match.property.area}m² • {match.property.rooms} pièces • {match.property.features.slice(0, 2).join(' • ')}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-kommo-accent">
                              {formatCurrency(match.property.price)}
                            </span>
                            <div className="flex gap-1">
                              {match.reasons.slice(0, 2).map((reason, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full"
                                >
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading State */}
              {isMatching && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                    <Brain className="w-8 h-8 text-purple-400 animate-spin" />
                  </div>
                  <p className="text-sm text-purple-400 mb-2">IA en cours d'analyse...</p>
                  <p className="text-xs text-white/30">Recherche des meilleurs biens correspondants</p>
                </div>
              )}
            </div>

            {/* Panel C: Automatisation */}
            <div className="lg:w-1/4 p-4 bg-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Automatisation</h3>
                <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Actif
                </div>
              </div>

              {/* Brochure Preview */}
              {selectedProperty && (
                <div className="mb-4">
                  <div className="relative glass-light rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-[3/4] p-3 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-gradient-to-br from-kommo-primary to-kommo-secondary"></div>
                          <span className="text-xs font-semibold text-gray-900">Inspirigence Real Estate</span>
                        </div>
                        <div className="px-2 py-0.5 bg-kommo-primary text-white text-xs font-bold rounded">Premium</div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                        {selectedProperty.images.length > 0 ? (
                          <img
                            src={selectedProperty.images[0]}
                            alt={selectedProperty.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-900 truncate">
                          {selectedProperty.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedProperty.area}m² • {selectedProperty.rooms} pièces • {selectedProperty.features.slice(0, 2).join(' • ')}
                        </div>
                        <div className="text-sm font-bold text-kommo-primary">
                          {formatCurrency(selectedProperty.price)}
                        </div>
                        <div className="text-xs text-gray-400">PDF Brandé • Haute qualité</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded">PDF</div>
                  </div>
                  <p className="text-sm text-white/70 mt-3 mb-1">Recevez la présentation par WhatsApp :</p>
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-kommo-primary focus:bg-white/15 transition-all"
                    />
                    <input
                      type="tel"
                      placeholder="0612345678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 text-sm focus:outline-none focus:border-kommo-primary focus:bg-white/15 transition-all"
                    />
                  </div>
                  <button 
                    onClick={handleSendBrochure}
                    disabled={isCreatingLead}
                    className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreatingLead ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Création du lead...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer via WhatsApp
                      </>
                    )}
                  </button>
                  
                  {/* Affichage des numéros sauvegardés */}
                  {savedNumbers.length > 0 && (
                    <div className="mt-3 p-2 bg-white/5 rounded-lg border border-white/10">
                      <div className="text-xs text-white/50 mb-1">Numéros enregistrés :</div>
                      <div className="space-y-1">
                        {savedNumbers.slice(-3).map((number, index) => (
                          <div key={index} className="text-xs text-green-400 flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            {number}
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <div className="text-xs text-white/30 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          Leads Tilda créés automatiquement
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Empty Brochure */}
              {!selectedProperty && (
                <div className="p-6 border border-dashed border-white/20 rounded-xl text-center mb-4">
                  <FileText className="w-8 h-8 text-white/20 mx-auto mb-2" />
                  <p className="text-xs text-white/40">Sélectionnez un bien pour générer une brochure</p>
                </div>
              )}

              {/* Documents Section */}
              <div className="mb-4">
                <label className="text-xs font-medium text-white/50 mb-2 block">Documents</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10 cursor-pointer hover:border-kommo-primary/50 transition-all" onClick={() => handleDocumentClick('Compromis de vente', 'compromis-vente')}>
                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/80">Compromis de vente</div>
                      <div className="text-xs text-white/40">PDF • 2.4 MB</div>
                    </div>
                    <Eye className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10 cursor-pointer hover:border-kommo-primary/50 transition-all" onClick={() => handleDocumentClick('Mandat de vente', 'mandat-vente')}>
                    <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/80">Mandat de vente</div>
                      <div className="text-xs text-white/40">PDF • 1.8 MB</div>
                    </div>
                    <Eye className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10 cursor-pointer hover:border-kommo-primary/50 transition-all" onClick={() => handleDocumentClick('Attestation propriété', 'attestation-propriete')}>
                    <div className="w-8 h-8 rounded bg-green-500/20 flex items-center justify-center">
                      <BadgeCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/80">Attestation propriété</div>
                      <div className="text-xs text-white/40">PDF • 890 KB</div>
                    </div>
                    <Eye className="w-4 h-4 text-white/30" />
                  </div>
                </div>
              </div>

              {/* WhatsApp Automation */}
              <div className="mb-4">
                <label className="text-xs font-medium text-white/50 mb-2 block text-center">Vivez l'expérience (en accéléré) <br /> WhatsApp Automation</label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/80">J1 - Brochure envoyée</div>
                      <div className="text-xs text-white/40">WhatsApp Automatique</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/50">J2 - Suivi personnalisé</div>
                      <div className="text-xs text-white/30">IA Analysis</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 glass rounded-lg border border-white/10 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white/50" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-white/50">J4 - Témoignage client</div>
                      <div className="text-xs text-white/30">Smart Content</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={handleSimulateRelance}
                  className="w-full mt-2 py-2 px-3 border border-white/20 rounded-lg text-xs font-medium text-white/60 hover:border-kommo-primary hover:text-kommo-primary transition-colors"
                >
                  Simuler automation
                </button>
              </div>      
              
                          </div>
          </div>

          {/* Info Bar */}
          <div className="p-4 bg-kommo-primary/10 border-t border-kommo-primary/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/70 flex items-center gap-2">
              <Zap className="w-4 h-4 text-kommo-primary" />
              Démo complète RealtyMatch - Scraping • IA • Automatisation • Sync Cloud
            </p>
            <a href="#" className="text-xs font-medium text-kommo-primary hover:underline flex items-center gap-1">
              Voir les packs
              <TrendingUp className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Document Modal */}
      <DocumentModal
        isOpen={isDocumentModalOpen}
        onClose={handleCloseDocumentModal}
        document={selectedDocument}
      />

      {/* PRO Popup Modal */}
      {showProPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="glass rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-kommo-primary to-kommo-secondary flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Fonctionnalité Premium</h3>
                  <p className="text-sm text-white/60">Pack PRO requis</p>
                </div>
              </div>
              <button 
                onClick={() => setShowProPopup(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <span className="text-white/60 hover:text-white text-xl">×</span>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white/70 mb-4">
                L'import automatique depuis Mubawab, Avito et Sarouty est disponible exclusivement dans le pack PRO.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Import automatique des annonces</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Synchronisation en temps réel</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Mise à jour automatique des stocks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Support prioritaire 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowProPopup(false)
                  window.open('https://inspirigence-consulting.com/immobilier#packages', '_blank')
                }}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-kommo-primary to-kommo-secondary hover:shadow-lg hover:shadow-kommo-primary/30 text-white text-sm font-medium rounded-lg transition-all"
              >
                Découvrir le pack PRO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
