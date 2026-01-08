export interface KommoConfig {
  subdomain: string;
  apiKey: string;
  pipelineId?: string;
  statusId?: string;
  responsibleUserId?: string;
}

export interface KommoLeadData {
  name: string;
  phone?: string;
  email?: string;
  budget?: { min: number; max: number };
  preferences?: {
    type: string;
    location: string[];
    features: string[];
  };
  source?: string;
  notes?: string;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{ value: any }>;
  }>;
}

export interface KommoLead {
  name: string;
  pipeline_id: number;
  status_id: number;
  responsible_user_id: number;
  custom_fields_values?: Array<{
    field_id: number;
    values: Array<{ value: any }>;
  }>;
}

export class KommoIntegration {
  private config: KommoConfig;
  private baseUrl: string;

  constructor(config: KommoConfig) {
    this.config = config;
    this.baseUrl = `https://${config.subdomain}.kommo.com/api/v4`;
  }

  /**
   * Crée un lead dans Kommo CRM
   */
  async createLead(leadData: KommoLeadData): Promise<{ success: boolean; message: string; leadId?: number }> {
    try {
      // Validation des données requises
      if (!leadData.name) {
        return {
          success: false,
          message: 'Le nom est requis'
        };
      }

      // Préparation des données pour Kommo
      const kommoLead: KommoLead = {
        name: leadData.name,
        pipeline_id: this.config.pipelineId ? parseInt(this.config.pipelineId) : 0,
        status_id: this.config.statusId ? parseInt(this.config.statusId) : 0,
        responsible_user_id: this.config.responsibleUserId ? parseInt(this.config.responsibleUserId) : 0
      };

      // Ajouter les champs personnalisés si présents
      if (leadData.custom_fields_values) {
        kommoLead.custom_fields_values = leadData.custom_fields_values;
      }

      // Sinon, créer les champs personnalisés à partir des données
      else {
        kommoLead.custom_fields_values = this.buildCustomFields(leadData);
      }

      // Appel à l'API Kommo
      const response = await fetch(`${this.baseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([kommoLead])
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erreur API Kommo:', errorData);
        return {
          success: false,
          message: `Erreur API Kommo: ${response.status} - ${errorData.message || 'Erreur inconnue'}`
        };
      }

      const result = await response.json();
      const leadId = result._embedded?.leads?.[0]?.id;

      if (leadId) {
        // Ajouter un contact si téléphone ou email fourni
        if (leadData.phone || leadData.email) {
          await this.addContactToLead(leadId, leadData);
        }

        console.log('✅ Lead créé dans Kommo:', leadId);
        return {
          success: true,
          message: 'Lead créé avec succès dans Kommo',
          leadId
        };
      }

      return {
        success: false,
        message: 'Réponse API invalide'
      };

    } catch (error) {
      console.error('❌ Erreur création lead Kommo:', error);
      return {
        success: false,
        message: `Erreur technique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Ajoute un contact au lead
   */
  private async addContactToLead(leadId: number, leadData: KommoLeadData): Promise<boolean> {
    try {
      const contactData: any = {
        name: leadData.name,
        custom_fields_values: []
      };

      // Ajouter le téléphone
      if (leadData.phone) {
        contactData.custom_fields_values.push({
          field_id: 1, // ID standard pour le téléphone dans Kommo
          values: [{ value: leadData.phone }]
        });
      }

      // Ajouter l'email
      if (leadData.email) {
        contactData.custom_fields_values.push({
          field_id: 2, // ID standard pour l'email dans Kommo
          values: [{ value: leadData.email }]
        });
      }

      // Créer le contact
      const contactResponse = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([contactData])
      });

      if (contactResponse.ok) {
        const contactResult = await contactResponse.json();
        const contactId = contactResult._embedded?.contacts?.[0]?.id;

        if (contactId) {
          // Lier le contact au lead
          await this.linkContactToLead(leadId, contactId);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur ajout contact:', error);
      return false;
    }
  }

  /**
   * Lie un contact à un lead
   */
  private async linkContactToLead(leadId: number, contactId: number): Promise<boolean> {
    try {
      const linkData = {
        to_entity_id: contactId,
        to_entity_type: 'contacts',
        metadata: {}
      };

      const response = await fetch(`${this.baseUrl}/leads/${leadId}/links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([linkData])
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erreur liaison contact-lead:', error);
      return false;
    }
  }

  /**
   * Construit les champs personnalisés pour Kommo
   */
  private buildCustomFields(leadData: KommoLeadData): Array<{ field_id: number; values: Array<{ value: any }> }> {
    const customFields: Array<{ field_id: number; values: Array<{ value: any }> }> = [];

    // Pour l'instant, nous n'ajoutons pas de champs personnalisés
    // car les IDs 1 et 2 ne sont pas valides dans ce compte Kommo
    // Les champs de base (nom, téléphone, email) seront gérés via les contacts

    return customFields;
  }

  /**
   * Récupère la liste des pipelines
   */
  async getPipelines(): Promise<{ success: boolean; pipelines?: any[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/pipelines`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          pipelines: data._embedded?.pipelines || []
        };
      }

      return {
        success: false,
        message: `Erreur: ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Récupère la liste des utilisateurs
   */
  async getUsers(): Promise<{ success: boolean; users?: any[]; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          users: data._embedded?.users || []
        };
      }

      return {
        success: false,
        message: `Erreur: ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }

  /**
   * Teste la connexion à Kommo
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/account`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        return {
          success: true,
          message: 'Connexion à Kommo établie avec succès'
        };
      }

      return {
        success: false,
        message: `Échec de connexion: ${response.status}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      };
    }
  }
}

// Configuration par défaut avec tes vraies valeurs Kommo
export const defaultKommoConfig: KommoConfig = {
  subdomain: process.env.KOMMO_SUBDOMAIN || 'inspirigence',
  apiKey: process.env.KOMMO_API_KEY || '',
  pipelineId: process.env.KOMMO_PIPELINE_ID || '12041207',
  statusId: process.env.KOMMO_STATUS_ID || '94018731',
  responsibleUserId: process.env.KOMMO_RESPONSIBLE_USER_ID || '12799707'
};

// Instance singleton
export const kommoIntegration = new KommoIntegration(defaultKommoConfig);
