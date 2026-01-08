// Test avec token en dur pour contourner le problème .env.local
process.env.KOMMO_API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFjOWE1ZjVjZWJjMDMwZGFhM2I1NGE2NjY1OTk1NmZlMDBjZjEwOGE1ODE0MjFmMjY3MTRiZmExNzY2YWU0YjAwZjFlZmZjNjcyNzRkNmI2In0.eyJhdWQiOiIyYmUwM2YxYy0yM2U3LTQwNWEtYmIzYy0yYThhMThlZTcwYWEiLCJqdGkiOiJhYzlhNWY1Y2ViYzAzMGRhYTNiNTRhNjY2NTk5NTZmZTAwY2YxMDhhNTgxNDIxZjI2NzE0YmZhMTc2NmFlNGIwMGYxZWZmYzY3Mjc0ZDZiNiIsImlhdCI6MTc2Nzg4ODgyMiwibmJmIjoxNzY3ODg4ODIyLCJleHAiOjE4OTQwNjA4MDAsInN1YiI6IjEyNzk5NzA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0NDU2NzM5LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNTg5MTc4ZDAtMTk2My00NzI5LWI3ODctYmFhYWUyYWExOWFjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.MgA2Ud5O44dNQS9p69FZdCJtWtD9aD6_Tq5KAgjQd2OqPry00NnO48ObDrjjNu0d9m4M437ly8Uby25IQMxUCl81r4iC-X6cHG4xi39XI_nK_nVg_SP68g84GIqpzQ3428FY2cCKAwQwnKM4rb-6K4TMcHuACepbPv_Cmj9E4v-O4phDSbOgTHP5o8H-t2CcOq0EQJe2nd4WIZdRey7obhx_t85RnxwmpYJQ6Z5dXeKH46Pp_asQapfhjnfP3gNtqpT4v_1PgNZFxGyGsAkhSyGbb4xqu3KLOupapM74nhrjx2vCVBPnLE7yvfeCpA0bJoWFjg3zGeAEZXfG5cvVxA';

const { kommoIntegration } = require('./src/lib/kommo-integration.ts');

async function testIntegration() {
  console.log('🧪 Test intégration Kommo...');
  
  try {
    const result = await kommoIntegration.createLead({
      name: 'Test Lead depuis Integration',
      phone: '+33612345678',
      email: 'test@integration.com',
      source: 'test_integration',
      notes: 'Test de l\'intégration RealtyMatch'
    });
    
    console.log('📋 Résultat:', result);
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

testIntegration();
