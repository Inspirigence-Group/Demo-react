import { NextRequest, NextResponse } from 'next/server';
import { kommoIntegration } from '@/lib/kommo-integration';

export async function GET() {
  try {
    console.log('🧪 Test de connexion à Kommo...');
    
    // Tester la connexion
    const connectionTest = await kommoIntegration.testConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        message: 'Échec de connexion à Kommo',
        error: connectionTest.message
      });
    }
    
    // Récupérer les pipelines
    const pipelinesResult = await kommoIntegration.getPipelines();
    
    // Récupérer les utilisateurs
    const usersResult = await kommoIntegration.getUsers();
    
    return NextResponse.json({
      success: true,
      message: 'Test Kommo réussi',
      connection: connectionTest,
      pipelines: pipelinesResult,
      users: usersResult
    });
    
  } catch (error) {
    console.error('❌ Erreur test Kommo:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors du test Kommo',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test création lead dans Kommo...');
    
    const body = await request.json();
    
    // Créer un lead de test
    const result = await kommoIntegration.createLead({
      name: body.name || 'Test Lead RealtyMatch',
      phone: body.phone || '+33612345678',
      email: body.email || 'test@realty-match.com',
      source: 'test_integration',
      notes: 'Lead de test depuis RealtyMatch',
      budget: { min: 1000000, max: 2000000 },
      preferences: {
        type: 'Appartement',
        location: ['Casablanca', 'Rabat'],
        features: ['parking', 'terrasse']
      }
    });
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      leadId: result.leadId
    });
    
  } catch (error) {
    console.error('❌ Erreur test création lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erreur lors du test de création de lead',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}
