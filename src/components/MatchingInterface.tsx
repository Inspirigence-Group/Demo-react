'use client'

import { useState, useEffect } from 'react'
import { useStore } from '@/store/use-store'
import { MatchingEngine } from '@/lib/matching-engine'
import { MatchResult } from '@/types'
import { Brain, Target, Users, Home, Star, TrendingUp, Zap, CheckCircle } from 'lucide-react'
import { formatCurrency, getScoreColor, getScoreBgColor, getStatusColor } from '@/lib/utils'

interface MatchingInterfaceProps {
  matchingEngine: MatchingEngine
}

export default function MatchingInterface({ matchingEngine }: MatchingInterfaceProps) {
  const { leads, properties, selectedLead, setSelectedLead, addMatch } = useStore()
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isMatching, setIsMatching] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)

  useEffect(() => {
    if (selectedLead && properties.length > 0) {
      performMatching(selectedLead.id)
    }
  }, [selectedLead, properties])

  const performMatching = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (!lead) return

    setIsMatching(true)
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const matchResults = matchingEngine.findBestMatches(lead, properties)
    setMatches(matchResults)
    setIsMatching(false)
  }

  const handleLeadSelect = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setSelectedLead(lead)
    }
  }

  const handleMatchSelect = (match: MatchResult) => {
    setSelectedMatch(match)
  }

  const handleConfirmMatch = () => {
    if (selectedMatch) {
      addMatch(selectedMatch)
      // Show success feedback
      setSelectedMatch(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Matching Intelligent</h1>
        <p className="text-slate-400">IA-powered property matching for your leads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Panel */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Leads
            </h2>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
              {leads.length}
            </span>
          </div>
          
          <div className="space-y-3">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => handleLeadSelect(lead.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedLead?.id === lead.id
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {lead.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{lead.name}</div>
                      <div className="text-xs text-slate-400">{lead.source}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Budget:</span>
                    <span className="text-green-400 font-medium">
                      {formatCurrency(lead.budget.min)} - {formatCurrency(lead.budget.max)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Recherche:</span>
                    <span className="text-white">{lead.preferences.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Localisation:</span>
                    <span className="text-white">{lead.preferences.location.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matching Results */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Résultats du Matching IA
            </h2>
            {isMatching && (
              <div className="flex items-center gap-2 text-purple-400">
                <Zap className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyse en cours...</span>
              </div>
            )}
          </div>

          {!selectedLead ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Brain className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-white font-medium mb-2">Sélectionnez un lead</p>
              <p className="text-slate-400 text-sm">L'IA analysera ses critères et trouvera les biens correspondants</p>
            </div>
          ) : matches.length === 0 && !isMatching ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Target className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-white font-medium mb-2">Aucun match trouvé</p>
              <p className="text-slate-400 text-sm">Essayez d'élargir les critères de recherche ou ajoutez plus de biens</p>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match, index) => (
                <div
                  key={`${match.property.id}-${index}`}
                  onClick={() => handleMatchSelect(match)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedMatch?.property.id === match.property.id
                      ? 'bg-purple-500/20 border border-purple-500/30'
                      : 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-medium">{match.property.title}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className={`text-sm font-bold ${getScoreColor(match.aiScore)}`}>
                            {match.aiScore}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Home className="w-4 h-4" />
                          {match.property.type} • {match.property.area}m²
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                          <TrendingUp className="w-4 h-4" />
                          {formatCurrency(match.property.price)}
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-sm mb-3">{match.property.description}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {match.property.features.slice(0, 4).map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {match.property.features.length > 4 && (
                          <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                            +{match.property.features.length - 4}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score de base:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${match.score}%` }}
                              />
                            </div>
                            <span className="text-blue-400 font-medium">{match.score}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Score IA:</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${match.aiScore}%` }}
                              />
                            </div>
                            <span className="text-purple-400 font-medium">{match.aiScore}%</span>
                          </div>
                        </div>
                        
                        {match.reasons.length > 0 && (
                          <div className="pt-2 border-t border-slate-700">
                            <p className="text-slate-400 text-xs mb-1">Raisons du match:</p>
                            <div className="flex flex-wrap gap-1">
                              {match.reasons.map((reason, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Match Confirmation Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Confirmer le match</h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Lead:</span>
                  <span className="text-white font-medium">{selectedMatch.lead.name}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Bien:</span>
                  <span className="text-white font-medium">{selectedMatch.property.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Score IA:</span>
                  <span className={`font-bold ${getScoreColor(selectedMatch.aiScore)}`}>
                    {selectedMatch.aiScore}%
                  </span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmMatch}
                  className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Confirmer et attacher
                </button>
                <button
                  onClick={() => setSelectedMatch(null)}
                  className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
