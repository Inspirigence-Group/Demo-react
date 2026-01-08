import { create } from 'zustand';
import { Lead, Property, MatchResult, DashboardStats } from '@/types';

interface Store {
  // Data
  leads: Lead[];
  properties: Property[];
  matches: MatchResult[];
  selectedLead: Lead | null;
  selectedProperty: Property | null;
  stats: DashboardStats | null;
  
  // Phone numbers storage
  phoneNumbers: string[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Lead creation limits
  maxAdditionalLeads: number;
  additionalLeadsCreated: number;
  
  // Actions
  setLeads: (leads: Lead[]) => void;
  setProperties: (properties: Property[]) => void;
  setMatches: (matches: MatchResult[]) => void;
  setSelectedLead: (lead: Lead | null) => void;
  setSelectedProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Lead actions
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  canCreateLead: () => boolean;
  
  // Property actions
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  
  // Match actions
  addMatch: (match: MatchResult) => void;
  removeMatch: (leadId: string, propertyId: string) => void;
  
  // Phone number actions
  addPhoneNumber: (phone: string) => void;
  getPhoneNumbers: () => string[];
  
  // Initialize with demo data
  initializeDemoData: () => void;
}

export const useStore = create<Store>((set, get) => ({
  // Initial state
  leads: [],
  properties: [],
  matches: [],
  selectedLead: null,
  selectedProperty: null,
  stats: null,
  phoneNumbers: [],
  isLoading: false,
  error: null,
  
  // Lead creation limits
  maxAdditionalLeads: 3,
  additionalLeadsCreated: 0,
  
  // Setters
  setLeads: (leads) => set({ leads }),
  setProperties: (properties) => set({ properties }),
  setMatches: (matches) => set({ matches }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  // Lead actions
  addLead: (lead) => set((state) => {
    const currentAdditionalLeads = state.additionalLeadsCreated;
    const canCreate = currentAdditionalLeads < state.maxAdditionalLeads;
    
    if (!canCreate) {
      return state; // Ne pas ajouter si la limite est atteinte
    }
    
    return {
      leads: [...state.leads, lead],
      additionalLeadsCreated: currentAdditionalLeads + 1
    };
  }),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map(lead => 
      lead.id === id ? { ...lead, ...updates, updatedAt: new Date() } : lead
    )
  })),
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter(lead => lead.id !== id),
    matches: state.matches.filter(match => match.lead.id !== id)
  })),
  canCreateLead: () => {
    const state = get();
    return state.additionalLeadsCreated < state.maxAdditionalLeads;
  },
  
  // Property actions
  addProperty: (property) => set((state) => ({ properties: [...state.properties, property] })),
  updateProperty: (id, updates) => set((state) => ({
    properties: state.properties.map(property => 
      property.id === id ? { ...property, ...updates, updatedAt: new Date() } : property
    )
  })),
  deleteProperty: (id) => set((state) => ({
    properties: state.properties.filter(property => property.id !== id),
    matches: state.matches.filter(match => match.property.id !== id)
  })),
  
  // Match actions
  addMatch: (match) => set((state) => ({ matches: [...state.matches, match] })),
  removeMatch: (leadId, propertyId) => set((state) => ({
    matches: state.matches.filter(match => 
      !(match.lead.id === leadId && match.property.id === propertyId)
    )
  })),
  
  // Phone number actions
  addPhoneNumber: (phone: string) => set((state) => {
    if (!state.phoneNumbers.includes(phone)) {
      return { phoneNumbers: [...state.phoneNumbers, phone] };
    }
    return state;
  }),
  getPhoneNumbers: () => {
    const state = get();
    return state.phoneNumbers;
  },
  
  // Initialize demo data
  initializeDemoData: () => {
    const demoLeads: Lead[] = [
      {
        id: '1',
        name: 'Youssef El Amrani',
        email: 'youssef@example.com',
        phone: '+212600000001',
        budget: { min: 1500000, max: 2500000 },
        preferences: {
          type: 'F3',
          location: ['Maarif', 'Gauthier'],
          features: ['parking', 'terrasse', 'proximite_transport'],
          minArea: 100
        },
        source: 'whatsapp',
        status: 'new',
        notes: 'Client sérieux, cherche bien lumineux',
        chatHistory: ['cherche F3 quartier calme', 'budget flexible si bien parfait', 'aime les terrasses'],
        aiProfile: 'Professionnel, cherche bien lumineux, priorise la localisation',
        priority: 'location',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: '2',
        name: 'Fatima Zahra',
        email: 'fatima@example.com',
        phone: '+212600000002',
        budget: { min: 4000000, max: 6000000 },
        preferences: {
          type: 'Villa',
          location: ['Anfa', 'Californie'],
          features: ['piscine', 'jardin', 'securite', 'ecoles_proches'],
          minRooms: 4,
          minArea: 300
        },
        source: 'instagram',
        status: 'contacted',
        notes: 'Famille aisée, recherche espace et confort',
        chatHistory: ['famille avec enfants', 'besoin jardin', 'sécurité importante'],
        aiProfile: 'Famille aisée, recherche espace et confort, priorise écoles',
        priority: 'space',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-06')
      },
      {
        id: '3',
        name: 'Omar Benjelloun',
        email: 'omar@example.com',
        phone: '+212600000003',
        budget: { min: 600000, max: 1000000 },
        preferences: {
          type: 'Studio',
          location: ['Gauthier', 'Maarif'],
          features: ['meuble', 'rendement_locatif', 'facile_entretien'],
          minArea: 40
        },
        source: 'facebook',
        status: 'visiting',
        notes: 'Investisseur débutant, recherche rentabilité',
        chatHistory: ['premier investissement', 'bon rendement locatif', 'peu d entretien'],
        aiProfile: 'Investisseur débutant, recherche rentabilité, prudent',
        priority: 'price',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-07')
      },
      {
        id: '4',
        name: 'Karim Alami',
        email: 'karim.alami@example.com',
        phone: '+212600000004',
        budget: { min: 2000000, max: 3500000 },
        preferences: {
          type: 'F4',
          location: ['Ain Diab', 'Corniche'],
          features: ['vue_mer', 'terrasse', 'parking', 'climatisation'],
          minRooms: 4,
          minArea: 140
        },
        source: 'website',
        status: 'new',
        notes: 'Famille avec 2 enfants, veut proximité plage',
        chatHistory: ['cherche F4 avec vue mer', 'proximité écoles internationales', 'budget négociable'],
        aiProfile: 'Famille moderne, recherche qualité de vie, priorise vue mer et écoles',
        priority: 'location',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: '5',
        name: 'Amina Bennani',
        email: 'amina.bennani@example.com',
        phone: '+212600000005',
        budget: { min: 800000, max: 1200000 },
        preferences: {
          type: 'F2',
          location: ['Hay Ryad', 'Agdal'],
          features: ['etage_eleve', 'lumineux', 'proximite_commerces'],
          minArea: 70
        },
        source: 'instagram',
        status: 'contacted',
        notes: 'Jeune professionnelle, premier achat',
        chatHistory: ['première acquisition', 'veux quartier calme', 'facilité paiement'],
        aiProfile: 'Jeune active, recherche modernité, priorise sécurité et commerces',
        priority: 'price',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-09')
      },
      {
        id: '6',
        name: 'Dr. Mehdi Kabbaj',
        email: 'mehdi.kabbaj@example.com',
        phone: '+212600000006',
        budget: { min: 5000000, max: 8000000 },
        preferences: {
          type: 'Villa',
          location: ['Tamaris', 'Val d\'Anfa'],
          features: ['piscine', 'jardin', 'securite', 'garage_multiple', 'vue_mer'],
          minRooms: 5,
          minArea: 400
        },
        source: 'phone',
        status: 'negotiating',
        notes: 'Médecin, recherche villa prestige pour famille',
        chatHistory: ['médecin à l\'hôpital', 'besoin espace bureau', 'quartier calme'],
        aiProfile: 'Professionnel libéral, recherche prestige et tranquillité, priorise sécurité',
        priority: 'space',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '7',
        name: 'Sara Oufkir',
        email: 'sara.oufkir@example.com',
        phone: '+212600000007',
        budget: { min: 3000000, max: 4500000 },
        preferences: {
          type: 'Riad',
          location: ['Medina', 'Kasbah'],
          features: ['patio', 'architecture_traditionnelle', 'renove'],
          minRooms: 4,
          minArea: 250
        },
        source: 'whatsapp',
        status: 'new',
        notes: 'Artiste, recherche riad avec caractère',
        chatHistory: ['amour architecture traditionnelle', 'espace création', 'authenticité'],
        aiProfile: 'Artiste, recherche authenticité et inspiration, priorise caractère',
        priority: 'features',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09')
      },
      {
        id: '8',
        name: 'Hamid Zahidi',
        email: 'hamid.zahidi@example.com',
        phone: '+212600000008',
        budget: { min: 900000, max: 1500000 },
        preferences: {
          type: 'F3',
          location: ['Bourgogne', 'Derb Sultan'],
          features: ['bon_etat', 'proximite_transport', 'commerces'],
          minArea: 90
        },
        source: 'facebook',
        status: 'visiting',
        notes: 'Famille modeste, recherche bien abordable',
        chatHistory: ['budget limité', 'quartier populaire mais sympa', 'transport essentiel'],
        aiProfile: 'Famille modeste, recherche rapport qualité/prix, priorise budget',
        priority: 'price',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-11')
      },
      {
        id: '9',
        name: 'Dr. Leila Mourad',
        email: 'leila.mourad@example.com',
        phone: '+212600000009',
        budget: { min: 1200000, max: 1800000 },
        preferences: {
          type: 'F2',
          location: ['Ain Sebaa', 'Sidi Moumen'],
          features: ['proximite_hopital', 'parking', 'securite'],
          minArea: 80
        },
        source: 'website',
        status: 'new',
        notes: 'Médecin cherche proximité hôpital',
        chatHistory: ['médecin à CHU', 'besoin parking', 'sécurité importante'],
        aiProfile: 'Professionnelle de santé, recherche praticité et sécurité',
        priority: 'location',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '10',
        name: 'Mohamed Chraibi',
        email: 'mohamed.chraibi@example.com',
        phone: '+212600000010',
        budget: { min: 2500000, max: 4000000 },
        preferences: {
          type: 'F4',
          location: ['Racine', 'Bourgogne'],
          features: ['terrasse', 'bon_etat', 'proximite_ecoles'],
          minRooms: 4,
          minArea: 130
        },
        source: 'whatsapp',
        status: 'contacted',
        notes: 'Famille avec 3 enfants',
        chatHistory: ['famille nombreuse', 'près écoles', 'terrasse essentielle'],
        aiProfile: 'Père de famille, priorise écoles et espace pour enfants',
        priority: 'space',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '11',
        name: 'Imane El Idrissi',
        email: 'imane.elidrissi@example.com',
        phone: '+212600000011',
        budget: { min: 700000, max: 1100000 },
        preferences: {
          type: 'Studio',
          location: ['Gauthier', 'Maarif'],
          features: ['meuble', 'proximite_transport', 'calme'],
          minArea: 35
        },
        source: 'instagram',
        status: 'new',
        notes: 'Jeune diplômée, premier logement',
        chatHistory: ['jeune professionnelle', 'budget serré', 'transport essentiel'],
        aiProfile: 'Jeune active, recherche indépendance et praticité',
        priority: 'price',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '12',
        name: 'Yassine Bensalem',
        email: 'yassine.bensalem@example.com',
        phone: '+212600000012',
        budget: { min: 3500000, max: 5500000 },
        preferences: {
          type: 'Villa',
          location: ['Tamaris', 'Val d\'Anfa'],
          features: ['piscine', 'vue_mer', 'securite', 'jardin'],
          minRooms: 5,
          minArea: 350
        },
        source: 'phone',
        status: 'visiting',
        notes: 'Entrepreneur recherche villa prestige',
        chatHistory: ['entrepreneur', 'besoin espace bureau', 'recevoir clients'],
        aiProfile: 'Entrepreneur, recherche image et confort pour recevoir',
        priority: 'features',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-14')
      }
    ];
    
    const demoProperties: Property[] = [
      {
        id: '1',
        title: 'Appartement F3 Maarif Premium',
        type: 'F3',
        location: 'Maarif',
        price: 1800000,
        area: 120,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        features: ['parking', 'terrasse', 'proximite_transport', 'lumineux', 'calme'],
        description: 'Magnifique F3 en plein cœur de Maarif, proche commerces et transports',
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format'
        ],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        title: 'F4 Racine Vue Mer',
        type: 'F4',
        location: 'Racine',
        price: 2200000,
        area: 150,
        rooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        features: ['terrasse', 'vue_mer', 'lumineux', 'ascenseur'],
        description: 'Spacieux F4 avec vue mer imprenable, quartier résidentiel calme',
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },
      {
        id: '3',
        title: 'Villa Anfa Supérieur',
        type: 'Villa',
        location: 'Anfa',
        price: 4800000,
        area: 450,
        rooms: 6,
        bedrooms: 5,
        bathrooms: 3,
        features: ['piscine', 'jardin', 'securite', 'ecoles_proches', 'garage', 'concierge'],
        description: 'Somptueuse villa dans le quartier prestigieux d\'Anfa, idéale pour famille',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1600210482481-3d61b85948c2?w=400&h=300&fit=crop&auto=format'
        ],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '4',
        title: 'Studio Gauthier Centre',
        type: 'Studio',
        location: 'Gauthier',
        price: 750000,
        area: 45,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1,
        features: ['meuble', 'proximite_commerces', 'rendement_eleve', 'calme'],
        description: 'Studio meublé idéal pour investissement locatif, quartier dynamique',
        images: ['https://images.unsplash.com/photo-1554995206-c28f74a75662?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
      },
      {
        id: '5',
        title: 'F3 Boulevard Nouveau',
        type: 'F3',
        location: 'Boulevard',
        price: 1600000,
        area: 110,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        features: ['renove', 'calme', 'proximite_transport'],
        description: 'F3 entièrement rénové, quartier calme mais proche commodités',
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'sarouty',
        status: 'available',
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04')
      },
      {
        id: '6',
        title: 'F4 Ain Diab Vue Mer Exceptionnelle',
        type: 'F4',
        location: 'Ain Diab',
        price: 3200000,
        area: 160,
        rooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        features: ['vue_mer', 'terrasse', 'parking', 'climatisation', 'proximite_plage'],
        description: 'F4 de prestige avec vue mer imprenable, à 2 pas de la plage et clubs',
        images: ['https://images.unsplash.com/photo-1600047509807-b608f8da6b5c?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: '7',
        title: 'F2 Hay Ryad Moderne',
        type: 'F2',
        location: 'Hay Ryad',
        price: 950000,
        area: 75,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        features: ['etage_eleve', 'lumineux', 'proximite_commerces', 'parking_souterrain'],
        description: 'F2 moderne dans résidence sécurisée, proche centres commerciaux',
        images: ['https://images.unsplash.com/photo-1600566753376-12c8ac723b80?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-06'),
        updatedAt: new Date('2024-01-06')
      },
      {
        id: '8',
        title: 'Villa Tamaris Luxe',
        type: 'Villa',
        location: 'Tamaris',
        price: 6500000,
        area: 520,
        rooms: 7,
        bedrooms: 6,
        bathrooms: 4,
        features: ['piscine', 'jardin', 'securite', 'garage_multiple', 'vue_mer', 'spa'],
        description: 'Villa de luxe avec vue mer, piscine infinie, jardin paysagé',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'claren',
        status: 'available',
        createdAt: new Date('2024-01-07'),
        updatedAt: new Date('2024-01-07')
      },
      {
        id: '9',
        title: 'Riad Medina Tradition',
        type: 'Riad',
        location: 'Medina',
        price: 3800000,
        area: 280,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 3,
        features: ['patio', 'architecture_traditionnelle', 'renove', 'terrasse_couverte'],
        description: 'Magnifique riad entièrement rénové, mélange tradition et modernité',
        images: ['https://images.unsplash.com/photo-1564399580075-5dfe19c205f3?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: '10',
        title: 'Studio Bourgogne Affaire',
        type: 'Studio',
        location: 'Bourgogne',
        price: 680000,
        area: 42,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1,
        features: ['bon_etat', 'proximite_transport', 'commerces', 'facile_a_louer'],
        description: 'Studio bien situé, idéal pour premier investissement locatif',
        images: ['https://images.unsplash.com/photo-1484154218962-a197022b773c?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-09'),
        updatedAt: new Date('2024-01-09')
      },
      {
        id: '11',
        title: 'F5 Val d\'Anfa Prestige',
        type: 'F5',
        location: 'Val d\'Anfa',
        price: 4200000,
        area: 200,
        rooms: 5,
        bedrooms: 4,
        bathrooms: 3,
        features: ['vue_mer', 'terrasse', 'parking_double', 'concierge', 'securite_24h'],
        description: 'F5 de prestige dans résidence de standing, vue mer panoramique',
        images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25418a?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'claren',
        status: 'available',
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: '12',
        title: 'F3 Agdal Residential',
        type: 'F3',
        location: 'Agdal',
        price: 1350000,
        area: 105,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        features: ['residence_securisee', 'parking', 'proximite_universite', 'calme'],
        description: 'F3 en résidence sécurisée, quartier calme et verdoyant',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'sarouty',
        status: 'available',
        createdAt: new Date('2024-01-11'),
        updatedAt: new Date('2024-01-11')
      },
      {
        id: '13',
        title: 'Villa Californie Jardin d\'Hiver',
        type: 'Villa',
        location: 'Californie',
        price: 5500000,
        area: 380,
        rooms: 6,
        bedrooms: 5,
        bathrooms: 3,
        features: ['piscine', 'jardin_hiver', 'ecoles_proches', 'terrain_sport', 'garage'],
        description: 'Villa moderne avec jardin d\'hiver, proche écoles internationales',
        images: ['https://images.unsplash.com/photo-1600210482481-3d61b85948c2?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: '14',
        title: 'F1 Centre Ville Casablanca',
        type: 'F1',
        location: 'Centre Ville',
        price: 580000,
        area: 35,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1,
        features: ['proximite_travail', 'transport_public', 'commerces', 'investissement'],
        description: 'F1 hyper centre, idéal pour jeune professionnel ou investissement',
        images: ['https://images.unsplash.com/photo-1502672260266-1c1a2bf9d855?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-13'),
        updatedAt: new Date('2024-01-13')
      },
      {
        id: '15',
        title: 'Appartement Derb Sultan Traditionnel',
        type: 'F3',
        location: 'Derb Sultan',
        price: 980000,
        area: 95,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        features: ['quartier_populaire', 'proximite_marche', 'ambiance_authentique', 'bon_rapport'],
        description: 'F3 au cœur de quartier authentique, ambiance conviviale',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'sarouty',
        status: 'available',
        createdAt: new Date('2024-01-14'),
        updatedAt: new Date('2024-01-14')
      },
      {
        id: '16',
        title: 'F2 Ain Sebaa Proximité Hopital',
        type: 'F2',
        location: 'Ain Sebaa',
        price: 1250000,
        area: 85,
        rooms: 2,
        bedrooms: 1,
        bathrooms: 1,
        features: ['proximite_hopital', 'parking', 'bon_etat', 'calme'],
        description: 'F2 idéal pour personnel médical, proche CHU Ibn Rochd',
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: '17',
        title: 'Studio Centre Commercial Maarif',
        type: 'Studio',
        location: 'Maarif',
        price: 890000,
        area: 38,
        rooms: 1,
        bedrooms: 1,
        bathrooms: 1,
        features: ['meuble', 'proximite_commerces', 'transport_public', 'investissement_locatif'],
        description: 'Studio meublé en plein cœur commercial, rendement locatif élevé',
        images: ['https://images.unsplash.com/photo-1484154218962-a197022b773c?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'mubawab',
        status: 'available',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '18',
        title: 'Villa Sidi Maarouf Jardin Exotique',
        type: 'Villa',
        location: 'Sidi Maarouf',
        price: 7200000,
        area: 480,
        rooms: 6,
        bedrooms: 5,
        bathrooms: 4,
        features: ['piscine', 'jardin_exotique', 'spa', 'home_cinema', 'securite', 'garage_triple'],
        description: 'Villa de luxe avec aménagement paysager unique, home cinéma intégré',
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'claren',
        status: 'available',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17')
      },
      {
        id: '19',
        title: 'F4 Racine Vue Panoramique',
        type: 'F4',
        location: 'Racine',
        price: 2800000,
        area: 165,
        rooms: 4,
        bedrooms: 3,
        bathrooms: 2,
        features: ['vue_panoramique', 'terrasse_large', 'parking_double', 'concierge', 'renovation_recente'],
        description: 'F4 avec vue panoramique sur Casablanca, rénovation haut de gamme',
        images: ['https://images.unsplash.com/photo-1600047509807-b608f8da6b5c?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'avito',
        status: 'available',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: '20',
        title: 'Appartement F3 Habous Quartier Historique',
        type: 'F3',
        location: 'Habous',
        price: 1450000,
        area: 115,
        rooms: 3,
        bedrooms: 2,
        bathrooms: 1,
        features: ['quartier_historique', 'architecture_art_deco', 'proximite_commerces_artisanaux', 'ambiance_culturelle'],
        description: 'F3 dans quartier historique préservé, ambiance authentique et charmante',
        images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop&auto=format'],
        scrapedFrom: 'sarouty',
        status: 'available',
        createdAt: new Date('2024-01-19'),
        updatedAt: new Date('2024-01-19')
      }
    ];
    
    const demoStats: DashboardStats = {
      totalLeads: 3,
      totalProperties: demoProperties.length,
      activeMatches: 8,
      conversionRate: 23.5,
      avgResponseTime: 2.3,
      topLocations: ['Maarif', 'Anfa', 'Gauthier'],
      recentActivity: []
    };
    
    set({
      leads: demoLeads.slice(0, 3),
      properties: demoProperties,
      matches: [],
      stats: demoStats
    })
  }
}));
