export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  budget: {
    min: number;
    max: number;
  };
  preferences: {
    type: 'Studio' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'Villa' | 'Riad' | 'Appartement';
    location: string[];
    features: string[];
    minRooms?: number;
    minArea?: number;
  };
  source: 'whatsapp' | 'instagram' | 'facebook' | 'website' | 'phone';
  status: 'new' | 'contacted' | 'visiting' | 'negotiating' | 'closed';
  notes: string;
  chatHistory: string[];
  aiProfile: string;
  priority: 'location' | 'price' | 'space' | 'features';
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  title: string;
  type: 'Studio' | 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'Villa' | 'Riad' | 'Appartement';
  location: string;
  price: number;
  area: number;
  rooms: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  description: string;
  images: string[];
  scrapedFrom?: 'mubawab' | 'avito' | 'sarouty' | 'claren' | 'manual';
  scrapedUrl?: string;
  status: 'available' | 'sold' | 'reserved';
  agentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchResult {
  property: Property;
  lead: Lead;
  score: number;
  aiScore: number;
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
  lastMatched: Date;
}

export interface MatchingCriteria {
  budgetWeight: number;
  locationWeight: number;
  featuresWeight: number;
  areaWeight: number;
  typeWeight: number;
}

export interface ScrapingResult {
  success: boolean;
  property?: Property;
  error?: string;
  source: string;
  url: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'compromis' | 'mandat' | 'attestation' | 'brochure' | 'contract';
  url: string;
  size: number;
  createdAt: Date;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: 'lead_created' | 'property_matched' | 'visit_scheduled' | 'document_sent';
  action: 'send_whatsapp' | 'send_email' | 'create_task' | 'notify_agent';
  delay: number; // in hours
  template: string;
  active: boolean;
}

export interface DashboardStats {
  totalLeads: number;
  totalProperties: number;
  activeMatches: number;
  conversionRate: number;
  avgResponseTime: number;
  topLocations: string[];
  recentActivity: Activity[];
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'property_added' | 'match_found' | 'document_sent' | 'visit_scheduled';
  description: string;
  timestamp: Date;
  userId?: string;
}
