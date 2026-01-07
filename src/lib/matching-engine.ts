import { Lead, Property, MatchResult, MatchingCriteria } from '@/types';

export class MatchingEngine {
  private defaultCriteria: MatchingCriteria = {
    budgetWeight: 0.3,
    locationWeight: 0.25,
    featuresWeight: 0.2,
    areaWeight: 0.15,
    typeWeight: 0.1
  };

  calculateMatch(lead: Lead, property: Property, criteria?: Partial<MatchingCriteria>): MatchResult {
    const weights = { ...this.defaultCriteria, ...criteria };
    
    // Budget matching (30%)
    const budgetScore = this.calculateBudgetScore(lead.budget, property.price);
    
    // Location matching (25%)
    const locationScore = this.calculateLocationScore(lead.preferences.location, property.location);
    
    // Features matching (20%)
    const featuresScore = this.calculateFeaturesScore(lead.preferences.features, property.features);
    
    // Area matching (15%)
    const areaScore = this.calculateAreaScore(lead.preferences.minArea, property.area);
    
    // Type matching (10%)
    const typeScore = this.calculateTypeScore(lead.preferences.type, property.type);
    
    // Calculate weighted score
    const score = Math.round(
      budgetScore * weights.budgetWeight +
      locationScore * weights.locationWeight +
      featuresScore * weights.featuresWeight +
      areaScore * weights.areaWeight +
      typeScore * weights.typeWeight
    );
    
    // AI enhancement based on chat history and profile
    const aiScore = this.calculateAIScore(lead, property, score);
    
    // Generate matching reasons
    const reasons = this.generateMatchingReasons(lead, property, {
      budgetScore,
      locationScore,
      featuresScore,
      areaScore,
      typeScore
    });
    
    // Determine confidence level
    const confidence = this.getConfidenceLevel(score, aiScore);
    
    return {
      property,
      lead,
      score,
      aiScore,
      reasons,
      confidence,
      lastMatched: new Date()
    };
  }

  private calculateBudgetScore(budget: { min: number; max: number }, propertyPrice: number): number {
    if (propertyPrice < budget.min) return 100; // Under budget is perfect
    if (propertyPrice > budget.max) return 0; // Over budget is no match
    
    // Within budget: calculate how close to the middle of budget range
    const budgetMidpoint = (budget.min + budget.max) / 2;
    const deviation = Math.abs(propertyPrice - budgetMidpoint);
    const maxDeviation = (budget.max - budget.min) / 2;
    
    return Math.max(0, Math.round(100 - (deviation / maxDeviation) * 50));
  }

  private calculateLocationScore(preferredLocations: string[], propertyLocation: string): number {
    if (preferredLocations.length === 0) return 50; // No preference
    
    // Exact match
    if (preferredLocations.some(loc => 
      loc.toLowerCase() === propertyLocation.toLowerCase()
    )) return 100;
    
    // Partial match (contains)
    if (preferredLocations.some(loc => 
      propertyLocation.toLowerCase().includes(loc.toLowerCase()) ||
      loc.toLowerCase().includes(propertyLocation.toLowerCase())
    )) return 75;
    
    // Same city/area (simplified for Moroccan context)
    const casablancaAreas = ['maarif', 'anfa', 'gauthier', 'racine', 'boulevard', 'californie', 'cil'];
    const propertyArea = propertyLocation.toLowerCase();
    const preferredArea = preferredLocations[0].toLowerCase();
    
    if (casablancaAreas.includes(propertyArea) && casablancaAreas.includes(preferredArea)) {
      return 60; // Same city but different area
    }
    
    return 20;
  }

  private calculateFeaturesScore(requiredFeatures: string[], propertyFeatures: string[]): number {
    if (requiredFeatures.length === 0) return 50;
    
    const matchedFeatures = requiredFeatures.filter(feature =>
      propertyFeatures.some(propFeature =>
        propFeature.toLowerCase().includes(feature.toLowerCase()) ||
        feature.toLowerCase().includes(propFeature.toLowerCase())
      )
    );
    
    return Math.round((matchedFeatures.length / requiredFeatures.length) * 100);
  }

  private calculateAreaScore(minArea: number | undefined, propertyArea: number): number {
    if (!minArea) return 50;
    
    if (propertyArea >= minArea) {
      // Bonus for extra space (up to 50% more)
      const extraSpaceRatio = (propertyArea - minArea) / minArea;
      if (extraSpaceRatio <= 0.5) return 100;
      return Math.max(80, Math.round(100 - (extraSpaceRatio - 0.5) * 40));
    }
    
    // Penalty for insufficient space
    const deficitRatio = (minArea - propertyArea) / minArea;
    return Math.max(0, Math.round(100 - deficitRatio * 150));
  }

  private calculateTypeScore(preferredType: string, propertyType: string): number {
    if (preferredType === propertyType) return 100;
    
    // Type compatibility matrix
    const compatibility: { [key: string]: string[] } = {
      'Studio': ['Studio', 'F1'],
      'F1': ['Studio', 'F1', 'F2'],
      'F2': ['F1', 'F2', 'F3'],
      'F3': ['F2', 'F3', 'F4'],
      'F4': ['F3', 'F4', 'F5'],
      'F5': ['F4', 'F5', 'Villa'],
      'Villa': ['F5', 'Villa', 'Riad'],
      'Riad': ['Villa', 'Riad'],
      'Appartement': ['Studio', 'F1', 'F2', 'F3', 'F4', 'F5', 'Appartement']
    };
    
    return compatibility[preferredType]?.includes(propertyType) ? 70 : 20;
  }

  private calculateAIScore(lead: Lead, property: Property, baseScore: number): number {
    let aiBonus = 0;
    
    // Analyze chat history for preferences
    const chatText = lead.chatHistory.join(' ').toLowerCase();
    
    // Priority-based scoring
    switch (lead.priority) {
      case 'location':
        if (this.calculateLocationScore(lead.preferences.location, property.location) >= 75) {
          aiBonus += 10;
        }
        break;
      case 'price':
        if (this.calculateBudgetScore(lead.budget, property.price) >= 80) {
          aiBonus += 10;
        }
        break;
      case 'space':
        if (property.area >= (lead.preferences.minArea || 0) * 1.2) {
          aiBonus += 10;
        }
        break;
      case 'features':
        if (this.calculateFeaturesScore(lead.preferences.features, property.features) >= 80) {
          aiBonus += 10;
        }
        break;
    }
    
    // Chat history analysis
    if (chatText.includes('lumineux') && property.features.includes('lumineux')) aiBonus += 5;
    if (chatText.includes('calme') && property.features.includes('calme')) aiBonus += 5;
    if (chatText.includes('parking') && property.features.includes('parking')) aiBonus += 5;
    if (chatText.includes('terrasse') && property.features.includes('terrasse')) aiBonus += 5;
    if (chatText.includes('proximité') && property.features.some(f => f.includes('proximite'))) aiBonus += 5;
    
    // Profile-based adjustments
    if (lead.aiProfile.includes('investisseur') && property.features.includes('rendement_locatif')) {
      aiBonus += 8;
    }
    if (lead.aiProfile.includes('famille') && property.rooms >= 4) {
      aiBonus += 8;
    }
    
    return Math.min(100, baseScore + aiBonus);
  }

  private generateMatchingReasons(lead: Lead, property: Property, scores: any): string[] {
    const reasons: string[] = [];
    
    if (scores.budgetScore >= 80) reasons.push('Prix dans le budget');
    if (scores.locationScore >= 75) reasons.push('Localisation idéale');
    if (scores.featuresScore >= 70) reasons.push('Équipements correspondants');
    if (scores.areaScore >= 80) reasons.push('Surface adaptée');
    if (scores.typeScore >= 70) reasons.push('Type de bien approprié');
    
    // Add specific feature matches
    const matchingFeatures = lead.preferences.features.filter(feature =>
      property.features.some(propFeature =>
        propFeature.toLowerCase().includes(feature.toLowerCase())
      )
    );
    
    if (matchingFeatures.length > 0) {
      reasons.push(`Comprend : ${matchingFeatures.slice(0, 2).join(', ')}`);
    }
    
    return reasons.slice(0, 4); // Max 4 reasons
  }

  private getConfidenceLevel(score: number, aiScore: number): 'low' | 'medium' | 'high' {
    const avgScore = (score + aiScore) / 2;
    
    if (avgScore >= 85) return 'high';
    if (avgScore >= 65) return 'medium';
    return 'low';
  }

  findBestMatches(lead: Lead, properties: Property[], limit: number = 5): MatchResult[] {
    const matches = properties
      .map(property => this.calculateMatch(lead, property))
      .filter(match => match.score >= 40) // Minimum threshold
      .sort((a, b) => b.aiScore - a.aiScore); // Sort by AI score
    
    return matches.slice(0, limit);
  }

  findLeadsForProperty(property: Property, leads: Lead[], limit: number = 5): MatchResult[] {
    const matches = leads
      .map(lead => this.calculateMatch(lead, property))
      .filter(match => match.score >= 40)
      .sort((a, b) => b.aiScore - a.aiScore);
    
    return matches.slice(0, limit);
  }
}
