import { NextRequest, NextResponse } from 'next/server';

const KOMMO_SUBDOMAIN = 'inspirigence';
const KOMMO_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFjOWE1ZjVjZWJjMDMwZGFhM2I1NGE2NjY1OTk1NmZlMDBjZjEwOGE1ODE0MjFmMjY3MTRiZmExNzY2YWU0YjAwZjFlZmZjNjcyNzRkNmI2In0.eyJhdWQiOiIyYmUwM2YxYy0yM2U3LTQwNWEtYmIzYy0yYThhMThlZTcwYWEiLCJqdGkiOiJhYzlhNWY1Y2ViYzAzMGRhYTNiNTRhNjY2NTk5NTZmZTAwY2YxMDhhNTgxNDIxZjI2NzE0YmZhMTc2NmFlNGIwMGYxZWZmYzY3Mjc0ZDZiNiIsImlhdCI6MTc2Nzg4ODgyMiwibmJmIjoxNzY3ODg4ODIyLCJleHAiOjE4OTQwNjA4MDAsInN1YiI6IjEyNzk5NzA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0NDY2NzM5LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNTg5MTg4ZDAtMTk2My00NzI5LWI3ODctYmFhYWUyYWExOWFjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.MgA2Ud5O44dNQS9p69FZdCJtWtD9aD6_Tq5KAgjQd2OqPry00NnO48ObDrjjNu0d9m4M437ly8Uby25IQMxUCl81r4iC-X6cHG4xi39XI_nK_nVg_SP68g84GIqpzQ3428FY2cCKAwQwnKM4rb-6K4TMcHuACepbPv_Cmj9E4v-O4phDSbOgTHP5o8H-t2CcOq0EQJe2nd4WIZdRey7obhx_t85RnxwmpYJQ6Z5dXeKH46Pp_asQapfhjnfP3gNtqpT4v_1PgNZFxGyGsAkhSyGbb4xqu3KLOupapM74nhrjx2vCVBPnLE7yvfeCpA0bJoWFjg3zGeAEZXfG5cvVxA';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nom et téléphone requis' },
        { status: 400 }
      );
    }

    const leadData = {
      name: String(name),
      pipeline_id: 12041207,
      status_id: 94018731,
      responsible_user_id: 12799707
    };

    const postData = JSON.stringify([leadData]);

    const response = await fetch(`https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KOMMO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: postData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Erreur API Kommo:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          message: `Erreur API Kommo: ${response.status}`,
          error: errorData 
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    const leadId = result._embedded?.leads?.[0]?.id;

    if (leadId) {
      console.log('✅ Lead créé dans Kommo:', leadId);
      return NextResponse.json({
        success: true,
        message: 'Lead créé avec succès dans Kommo',
        leadId,
        pipelineId: 12041207,
        statusId: 94018731
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Réponse API invalide'
    });

  } catch (error) {
    console.error('❌ Erreur création lead:', error);
    return NextResponse.json(
      { 
        success: false,
        message: `Erreur technique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API Test Kommo - Configuration Directe',
    status: 'active',
    pipeline: 'P1 - ACQUISITION',
    status_name: 'NewLeads'
  });
}
