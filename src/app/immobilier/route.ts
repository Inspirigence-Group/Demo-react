import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📨 Webhook Tilda reçu sur /immobilier!');
    
    // Récupérer les données du formulaire (Tilda envoie en form-urlencoded)
    const contentType = request.headers.get('content-type');
    let data: any = {};
    
    if (contentType?.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      data = Object.fromEntries(params);
    } else {
      // Fallback pour JSON
      data = await request.json();
    }
    
    console.log('📋 Données reçues:', data);
    
    // Valider les données requises par Tilda
    const { Name, Phone, Email, Comments, tranid, formid, pageid, projectid } = data;
    
    if (!Name || !Phone) {
      console.error('❌ Données incomplètes:', { Name, Phone });
      return new NextResponse('Missing required fields', { status: 400 });
    }
    
    // Créer un ID de lead basé sur tranid si disponible
    const leadId = tranid || `TL_${projectid || 'unknown'}_${Date.now()}`;
    
    // Log du lead créé
    const leadData = {
      id: leadId,
      name: Name,
      phone: Phone,
      email: Email || '',
      comments: Comments || '',
      tranid,
      formid,
      pageid,
      projectid,
      timestamp: new Date().toISOString(),
      source: 'tilda-webhook',
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
    
    // Réponse conforme au protocole Tilda: "ok" en texte brut
    return new NextResponse('ok', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur webhook Tilda:', error);
    return new NextResponse('error', { status: 500 });
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
