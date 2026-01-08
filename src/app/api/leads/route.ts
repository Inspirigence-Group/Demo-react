import { NextRequest, NextResponse } from 'next/server';
import { kommoIntegration } from '@/lib/kommo-integration';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Formulaire reçu!');
    
    // Récupérer les données du formulaire
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    console.log('📋 Données reçues:', data);
    
    // Valider les données requises
    const { name, phone, email } = data;
    
    if (!name || !phone) {
      console.error('❌ Données incomplètes:', { name, phone });
      return NextResponse.json(
        { error: 'Nom et téléphone requis' },
        { status: 400 }
      );
    }
    
    // Créer un ID de lead
    const leadId = `RM_${Date.now()}`;
    
    // Log du lead créé
    const leadData: any = {
      id: leadId,
      name: String(name),
      phone: String(phone),
      email: email ? String(email) : '',
      timestamp: new Date().toISOString(),
      source: 'realty-match-demo',
      ...data
    };
    
    console.log('✅ Lead créé:', leadData);
    
    // 🔄 Envoi vers Kommo CRM
    try {
      console.log('📤 Envoi vers Kommo CRM...');
      
      const kommoResult = await kommoIntegration.createLead({
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email,
        source: leadData.source,
        notes: `Lead depuis RealtyMatch - ${new Date().toISOString()}`
      });
      
      if (kommoResult.success) {
        console.log('✅ Lead créé dans Kommo:', kommoResult.leadId);
        leadData.kommoLeadId = kommoResult.leadId;
        
        return NextResponse.json({
          success: true,
          message: 'Lead créé avec succès dans Kommo',
          leadId: kommoResult.leadId,
          data: leadData
        });
      } else {
        console.error('❌ Erreur Kommo:', kommoResult.message);
        leadData.kommoError = kommoResult.message;
        
        return NextResponse.json({
          success: false,
          message: 'Erreur lors de la création du lead dans Kommo',
          error: kommoResult.message,
          data: leadData
        });
      }
    } catch (kommoError) {
      console.error('❌ Erreur critique Kommo:', kommoError);
      leadData.kommoError = 'Erreur technique lors de l\'envoi vers Kommo';
      
      return NextResponse.json({
        success: false,
        message: 'Erreur technique Kommo',
        error: 'Erreur technique lors de l\'envoi vers Kommo',
        data: leadData
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur formulaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API RealtyMatch - Kommo Integration',
    status: 'active',
    endpoint: '/api/leads'
  });
}
