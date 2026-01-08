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

      // Si une URL de webhook est configurée, on l'utilise
      if (this.config.webhookUrl) {
        return await this.sendViaWebhook(tildaData);
      }

      // Sinon, on essaie d'abord le formulaire Tilda
      return await this.sendViaTildaForm(tildaData);

    } catch (error) {
      console.error('Erreur lors de la création du lead Tilda:', error);
      return {
        success: false,
        message: 'Erreur technique lors de la création du lead'
      };
    }
  }

  /**
   * Envoie les données via webhook Tilda
   */
  private async sendViaWebhook(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      const response = await fetch(this.config.webhookUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data as any).toString()
      });

      if (response.ok) {
        const leadId = `TL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          message: 'Lead créé avec succès via webhook Tilda',
          leadId
        };
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erreur webhook Tilda:', error);
      return {
        success: false,
        message: 'Échec de l\'envoi via webhook Tilda'
      };
    }
  }

  /**
   * Crée un lead dans Tilda via API directe
   */
  private async sendViaTildaAPI(data: TildaFormData): Promise<{ success: boolean; message: string; leadId?: string }> {
    try {
      // Utilisation de l'API Tilda pour créer un lead
      // Note: Tilda n'a pas d'API directe pour créer des leads, 
      // mais on peut utiliser leur système de formulaires
      
      // Créer les données du formulaire
      const formData = new URLSearchParams();
      formData.append('name', data.name);
      formData.append('phone', data.phone);
      formData.append('email', data.email || '');
      formData.append('formid', data.formid);
      formData.append('pageid', data.pageid);
      formData.append('projectid', data.projectid);
      formData.append('formname', data.formname);

      // Ajouter les champs additionnels
      Object.keys(data).forEach(key => {
        if (!['name', 'phone', 'email', 'formid', 'pageid', 'projectid', 'formname'].includes(key)) {
          formData.append(key, String(data[key]));
        }
      });

      console.log('📤 Envoi vers Tilda API:', {
        url: `https://forms.tilda.cc/js/submit/${this.config.projectId}/`,
        data: Object.fromEntries(formData)
      });

      const response = await fetch(`https://forms.tilda.cc/js/submit/${this.config.projectId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (response.ok) {
        const leadId = `TL_${this.config.projectId}_${Date.now()}`;
        console.log('✅ Lead Tilda créé via API:', leadId);
        
        return {
          success: true,
          message: 'Lead créé avec succès via API Tilda',
          leadId
        };
      } else {
        console.error('❌ Erreur API Tilda:', response.status, response.statusText);
        return {
          success: false,
          message: `Erreur API Tilda: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('❌ Erreur API Tilda:', error);
      return {
        success: false,
        message: 'Échec de la création via API Tilda'
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
  formId: process.env.NEXT_PUBLIC_TILDA_FORM_ID || 'realty-match-form',
  webhookUrl: process.env.TILDA_WEBHOOK_URL
};

// Instance singleton pour l'application
export const tildaIntegration = new TildaIntegration(defaultTildaConfig);
