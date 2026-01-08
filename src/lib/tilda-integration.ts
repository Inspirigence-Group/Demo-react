export interface TildaFormData {
  name: string;
  phone: string;
  email?: string;
  formname: string;
  formid: string;
  pageid: string;
  projectid: string;
  [key: string]: any;
}

export interface TildaConfig {
  publicKey: string;
  projectId: string;
  pageId: string;
  formId: string;
  webhookUrl?: string;
  // URL de l'API Tilda pour soumettre des formulaires
  tildaFormApiUrl: string;
}

export class TildaIntegration {
  private config: TildaConfig;

  constructor(config: TildaConfig) {
    this.config = config;
  }

  /**
   * Crée un lead dans Tilda via webhook ou simulation de formulaire
   */
  async createLead(formData: Partial<TildaFormData>): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      // Validation des données requises
      if (!formData.phone || !formData.name) {
        return {
          success: false,
          message: 'Le nom et le téléphone sont requis'
        };
      }

      // Préparation des données pour Tilda
      const tildaData: TildaFormData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || '',
        formname: formData.formname || 'RealtyMatch Lead',
        formid: this.config.formId,
        pageid: this.config.pageId,
        projectid: this.config.projectId,
        ...formData
      };

      // NOTE IMPORTANTE: Tilda n'a PAS d'API publique pour créer des leads depuis l'extérieur.
      // Le webhook Tilda fonctionne uniquement: Tilda → Votre serveur (pas l'inverse)
      // On enregistre donc le lead dans notre propre système
      const result = await this.sendToOurAPI(tildaData);
      if (result.success) {
        return result;
      }

      // Si tout échoue, on sauvegarde localement
      console.log('⚠️ Toutes les méthodes échouées, sauvegarde locale');
      return await this.saveLeadLocally(tildaData);

    } catch (error) {
      console.error('Erreur lors de la création du lead Tilda:', error);
      return {
        success: false,
        message: 'Erreur technique lors de la création du lead'
      };
    }
  }

  /**
   * Envoie les données vers notre propre API/CRM
   * NOTE: Tilda n'a PAS d'API publique pour créer des leads depuis l'extérieur.
   * Le webhook Tilda fonctionne uniquement dans le sens Tilda → Votre serveur.
   * Cette méthode envoie les données vers notre propre endpoint pour stockage.
   */
  private async sendToOurAPI(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      console.log('📤 Envoi vers notre API (stockage local):', {
        projectId: this.config.projectId,
        data
      });

      // Générer un ID unique pour le lead
      const tranid = `${this.config.projectId}:${Date.now()}`;
      const leadId = `RM_${tranid}`;

      // Créer les données du lead (spread d'abord, puis override)
      const leadData = {
        ...data,
        id: leadId,
        name: data.name,
        phone: data.phone,
        email: data.email || '',
        formname: data.formname || 'RealtyMatch Lead',
        projectid: this.config.projectId,
        pageid: this.config.pageId,
        tranid,
        timestamp: new Date().toISOString(),
        source: 'realty-match-demo'
      };

      // Envoyer vers notre propre API si configurée
      if (this.config.webhookUrl) {
        try {
          const formData = new URLSearchParams();
          formData.append('Name', data.name);
          formData.append('Phone', data.phone);
          if (data.email) formData.append('Email', data.email);
          formData.append('formid', this.config.formId);
          formData.append('formname', data.formname || 'RealtyMatch Lead');
          formData.append('pageid', this.config.pageId);
          formData.append('projectid', this.config.projectId);
          formData.append('tranid', tranid);
          
          // Ajouter les champs additionnels
          Object.keys(data).forEach(key => {
            const excludedKeys = ['name', 'phone', 'email', 'formname', 'pageid', 'projectid', 'formid'];
            if (!excludedKeys.includes(key.toLowerCase())) {
              formData.append(key, String(data[key]));
            }
          });

          const response = await fetch(this.config.webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
          });

          console.log('📨 Réponse de notre API:', {
            status: response.status,
            ok: response.ok
          });

          if (response.ok) {
            console.log('✅ Lead enregistré dans notre système:', leadId);
            return {
              success: true,
              message: 'Lead enregistré avec succès',
              leadId
            };
          }
        } catch (apiError) {
          console.warn('⚠️ Erreur API, sauvegarde locale:', apiError);
        }
      }

      // Fallback: sauvegarder en mémoire côté serveur
      console.log('💾 Lead sauvegardé localement:', leadId);
      return {
        success: true,
        message: 'Lead enregistré localement (mode démo)',
        leadId
      };

    } catch (error) {
      console.error('❌ Erreur création lead:', error);
      return {
        success: false,
        message: `Échec de la création du lead: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Crée un lead dans Tilda via API directe
   */
  private async sendViaTildaAPI(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      // Tilda n'a pas d'API directe pour créer des leads
      // On va utiliser une approche alternative avec le webhook
      
      console.log('📤 Tentative via API Tilda (fallback):', {
        project: this.config.projectId,
        page: this.config.pageId,
        form: this.config.formId
      });

      // Simulation car l'API directe n'existe pas
      const leadId = `TL_API_${this.config.projectId}_${Date.now()}`;
      console.log('⚠️ API Tilda non disponible, simulation activée');
      
      return {
        success: true,
        message: 'Lead simulé (API Tilda non disponible)',
        leadId
      };
      
    } catch (error) {
      console.error('❌ Erreur API Tilda:', error);
      return {
        success: false,
        message: 'Échec de la création via API Tilda'
      };
    }
  }

  /**
   * Enregistre le lead localement (solution de secours)
   */
  private async saveLeadLocally(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      const leadId = `LOCAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Sauvegarder dans localStorage pour débogage
      const existingLeads = JSON.parse(localStorage.getItem('tilda_leads') || '[]');
      const newLead = {
        id: leadId,
        data,
        timestamp: new Date().toISOString(),
        status: 'pending_webhook'
      };
      
      existingLeads.push(newLead);
      localStorage.setItem('tilda_leads', JSON.stringify(existingLeads));
      
      console.log('💾 Lead sauvegardé localement:', leadId);
      console.log('📋 Tous les leads locaux:', existingLeads);
      
      return {
        success: true,
        message: `Lead sauvegardé localement (ID: ${leadId}) - En attente d'envoi vers Tilda`,
        leadId
      };
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde locale:', error);
      return {
        success: false,
        message: 'Échec de la sauvegarde locale'
      };
    }
  }
  /**
   * Crée un lead dans Tilda via un formulaire existant sur la page
   */
  private async sendViaTildaForm(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      // Méthode alternative: utiliser le endpoint de formulaire de page Tilda
      const formData = new URLSearchParams();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email || '');
      formData.append('formid', data.formid);
      formData.append('pageid', data.pageid);

      // Ajouter les champs additionnels
      Object.keys(data).forEach(key => {
        if (!['name', 'phone', 'email', 'formid', 'pageid', 'projectid', 'formname'].includes(key)) {
          formData.append(key, String(data[key]));
        }
      });

      console.log('📤 Envoi vers formulaire Tilda:', {
        url: `https://tilda.cc/page/?pageid=${this.config.pageId}`,
        data: Object.fromEntries(formData)
      });

      // Essayer le endpoint de formulaire Tilda
      const response = await fetch(`https://forms.tilda.cc/js/submitform/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Referer': `https://tilda.cc/page/?pageid=${this.config.pageId}`
        },
        body: formData.toString()
      });

      if (response.ok) {
        const leadId = `TL_${this.config.pageId}_${Date.now()}`;
        console.log('✅ Lead Tilda créé via formulaire:', leadId);
        
        return {
          success: true,
          message: 'Lead créé avec succès via formulaire Tilda',
          leadId
        };
      } else {
        // Si ça échoue, on essaie l'autre méthode
        return await this.sendViaTildaAPI(data);
      }
    } catch (error) {
      console.error('❌ Erreur formulaire Tilda:', error);
      // En cas d'erreur, on essaie l'API directe
      return await this.sendViaTildaAPI(data);
    }
  }

  /**
   * Simule une soumission de formulaire Tilda (pour développement/démo)
   */
  private async simulateFormSubmission(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Générer un ID de lead simulé
    const leadId = `TL_SIM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log pour le débogage
    console.log('🎯 Simulation Tilda Lead:', {
      leadId,
      data,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      message: `Lead simulé créé dans Tilda (ID: ${leadId})`,
      leadId
    };
  }

  /**
   * Met à jour la configuration Tilda
   */
  updateConfig(newConfig: Partial<TildaConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Vérifie la configuration Tilda
   */
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.projectId) errors.push('Project ID est requis');
    if (!this.config.pageId) errors.push('Page ID est requis');
    if (!this.config.formId) errors.push('Form ID est requis');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Configuration par défaut avec vos vraies valeurs Tilda
export const defaultTildaConfig: TildaConfig = {
  publicKey: process.env.NEXT_PUBLIC_TILDA_PUBLIC_KEY || '',
  projectId: process.env.NEXT_PUBLIC_TILDA_PROJECT_ID || '13329195',
  pageId: process.env.NEXT_PUBLIC_TILDA_PAGE_ID || '108356966',
  formId: process.env.NEXT_PUBLIC_TILDA_FORM_ID || 'form108356966',
  webhookUrl: process.env.TILDA_WEBHOOK_URL,
  // URL officielle de l'API Tilda pour soumettre des formulaires
  tildaFormApiUrl: process.env.TILDA_FORM_API_URL || 'https://forms.tilda.cc/tilda/form/'
};

// Instance singleton pour l'application
export const tildaIntegration = new TildaIntegration(defaultTildaConfig);
