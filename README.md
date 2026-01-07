# RealtyMatch CRM

Une plateforme moderne de gestion immobilière avec système de matching IA intelligent pour le marché marocain.

## 🚀 Fonctionnalités

### 🎯 **Système de Matching Intelligent**
- **Matching algorithmique avancé** basé sur budget, localisation, équipements
- **Analyse IA** des conversations et profils clients
- **Score de confiance** avec raisons explicatives
- **Matching en temps réel** avec interface interactive

### 📊 **Gestion des Leads**
- **CRN complet** avec suivi automatique
- **Profils détaillés** avec préférences et budget
- **Historique des conversations** pour analyse IA
- **Statuts personnalisables** (nouveau, contacté, visite, négociation, fermé)

### 🏠 **Gestion des Biens**
- **Catalogue complet** avec photos et descriptions
- **Import depuis plateformes** (Mubawab, Avito, Sarouty)
- **Statuts en temps réel** (disponible, vendu, réservé)
- **Recherche avancée** par type, localisation, prix

### 📈 **Dashboard Analytics**
- **Métriques de performance** en temps réel
- **Taux de conversion** et temps de réponse moyen
- **Top localisations** et statistiques du marché
- **Activité récente** et notifications

### 🎨 **Interface Moderne**
- **Design responsive** avec Tailwind CSS
- **Mode sombre** avec effets glass morphism
- **Animations fluides** et transitions
- **Accessible** et optimisé UX

## 🛠️ Architecture Technique

### **Stack Technologique**
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: Zustand
- **UI Components**: Lucide React Icons
- **PDF Generation**: jsPDF + html2canvas
- **Deployment**: Vercel (static export)

### **Structure du Projet**
```
src/
├── app/                 # Pages Next.js 14
│   ├── globals.css     # Styles globaux
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d'accueil
├── components/         # Composants React
│   ├── Dashboard.tsx   # Dashboard analytics
│   ├── LeadManagement.tsx # Gestion leads
│   ├── PropertyManagement.tsx # Gestion biens
│   ├── MatchingInterface.tsx # Interface matching
│   └── Navigation.tsx  # Navigation principale
├── lib/                # Utilitaires
│   ├── matching-engine.ts # Moteur de matching IA
│   └── utils.ts        # Fonctions utilitaires
├── store/              # State management
│   └── use-store.ts    # Store Zustand
└── types/              # Types TypeScript
    └── index.ts        # Types principaux
```

## 🤖 Moteur de Matching IA

### **Algorithmes de Scoring**
1. **Budget (30%)**: Analyse de compatibilité prix/budget
2. **Localisation (25%)**: Correspondance géographique exacte et partielle
3. **Équipements (20%)**: Matching des features demandés
4. **Surface (15%)**: Adéquation espace/besoins
5. **Type (10%)**: Compatibilité type de bien

### **Intelligence Artificielle**
- **Analyse sémantique** des conversations clients
- **Profils comportementaux** pour affiner les recommandations
- **Priorité personnalisée** (localisation, prix, espace, équipements)
- **Apprentissage continu** basé sur les interactions

## 🚀 Démarrage Rapide

### **Installation**
```bash
# Cloner le projet
git clone <repository-url>
cd realtymatch-crm

# Installer les dépendances
npm install

# Démarrer le développement
npm run dev
```

### **Déploiement**
```bash
# Build pour production
npm run build

# Export statique (Vercel)
npm run export
```

## 📱 Utilisation

### **1. Dashboard**
Vue d'ensemble avec métriques clés et activité récente.

### **2. Leads**
- Ajouter, modifier, supprimer des leads
- Filtrer par statut et recherche
- Voir les détails et préférences

### **3. Biens**
- Gérer le catalogue immobilier
- Importer depuis plateformes externes
- Mettre à jour statuts et informations

### **4. Matching IA**
- Sélectionner un lead
- Voir les recommandations en temps réel
- Analyser les scores et raisons du match
- Confirmer et attacher les biens

## 🎯 Cas d'Usage

### **Agents Immobiliers**
- **Automatisation** du matching leads/biens
- **Gain de temps** dans la recherche
- **Meilleure conversion** avec recommandations pertinentes

### **Agences Immobilières**
- **Centralisation** des données clients et biens
- **Analytics** pour optimiser la stratégie
- **Collaboration** d'équipe simplifiée

### **Développeurs**
- **API extensible** pour intégrations
- **Code modulaire** et maintenable
- **Documentation** complète

## 🔧 Configuration

### **Variables d'Environnement**
```env
NEXT_PUBLIC_APP_NAME=RealtyMatch CRM
NEXT_PUBLIC_APP_DESCRIPTION=Real Estate Management Platform
```

### **Personnalisation**
- **Thèmes**: Modifier `tailwind.config.js`
- **Matching**: Ajuster poids dans `matching-engine.ts`
- **Types**: Étendre `types/index.ts`

## 📊 Performance

### **Optimisations**
- **Static Site Generation** pour Vercel
- **Code splitting** automatique
- **Images optimisées** avec Next.js
- **Lazy loading** des composants

### **Métriques**
- **First Load**: ~82KB
- **Build Time**: <30s
- **Lighthouse**: 95+ Performance

## 🤝 Contribuer

### **Développement**
1. Fork le projet
2. Créer une branche feature
3. Commiter les changements
4. Pull request

### **Standards**
- **TypeScript** strict
- **ESLint** configuré
- **Prettier** formatage
- **Tests** unitaires

## 📄 Licence

MIT License - voir fichier LICENSE

## 🎉 Conclusion

RealtyMatch CRM est une solution complète et moderne pour la gestion immobilière au Maroc, avec un système de matching IA intelligent qui optimise le temps des agents et améliore l'expérience client.

**Prêt à transformer votre activité immobilière ? 🚀**
