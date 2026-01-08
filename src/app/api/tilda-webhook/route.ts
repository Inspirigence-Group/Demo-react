import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Webhook Tilda reçu!');
    
    // Récupérer les données du formulaire
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    console.log('📋 Données reçues:', data);
    
    // Valider les données requises
    const { name, phone, email, formname, pageid, projectid } = data;
    
    if (!name || !phone) {
      console.error('❌ Données incomplètes:', { name, phone });
      return NextResponse.json(
        { error: 'Nom et téléphone requis' },
        { status: 400 }
      );
    }
    
    // Créer un ID de lead
    const leadId = `TL_${projectid}_${Date.now()}`;
    
    // Log du lead créé
    const leadData = {
      id: leadId,
      name,
      phone,
      email: email || '',
      formname: formname || 'RealtyMatch Lead',
      pageid,
      projectid,
      timestamp: new Date().toISOString(),
      source: 'realty-match-demo',
      ...data
    };
    
    console.log('✅ Lead Tilda créé:', leadData);
    
    // TODO: Ici vous pouvez ajouter l'envoi vers un vrai CRM
    // Par exemple: envoyer vers votre base de données, email, etc.
    
    // Sauvegarder en mémoire pour le débogage (en production, utilisez une vraie DB)
    if (!(globalThis as any).tildaLeads) {
      (globalThis as any).tildaLeads = [];
    }
    (globalThis as any).tildaLeads.push(leadData);
    
    console.log('📊 Total des leads:', (globalThis as any).tildaLeads.length);
    
    return NextResponse.json({
      success: true,
      message: 'Lead créé avec succès',
      leadId,
      data: leadData
    });
    
  } catch (error) {
    console.error('❌ Erreur webhook Tilda:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Endpoint pour voir les leads (débugage)
  const leads = (globalThis as any).tildaLeads || [];
  
  return NextResponse.json({
    message: 'Leads Tilda enregistrés',
    count: leads.length,
    leads: leads
  });
}
