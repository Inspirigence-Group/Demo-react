const https = require('https');

const SUBDOMAIN = 'inspirigence';
const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFjOWE1ZjVjZWJjMDMwZGFhM2I1NGE2NjY1OTk1NmZlMDBjZjEwOGE1ODE0MjFmMjY3MTRiZmExNzY2YWU0YjAwZjFlZmZjNjcyNzRkNmI2In0.eyJhdWQiOiIyYmUwM2YxYy0yM2U3LTQwNWEtYmIzYy0yYThhMThlZTcwYWEiLCJqdGkiOiJhYzlhNWY1Y2ViYzAzMGRhYTNiNTRhNjY2NTk5NTZmZTAwY2YxMDhhNTgxNDIxZjI2NzE0YmZhMTc2NmFlNGIwMGYxZWZmYzY3Mjc0ZDZiNiIsImlhdCI6MTc2Nzg4ODgyMiwibmJmIjoxNzY3ODg4ODIyLCJleHAiOjE4OTQwNjA4MDAsInN1YiI6IjEyNzk5NzA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0NDU2NzM5LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNTg5MTc4ZDAtMTk2My00NzI5LWI3ODctYmFhYWUyYWExOWFjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.MgA2Ud5O44dNQS9p69FZdCJtWtD9aD6_Tq5KAgjQd2OqPry00NnO48ObDrjjNu0d9m4M437ly8Uby25IQMxUCl81r4iC-X6cHG4xi39XI_nK_nVg_SP68g84GIqpzQ3428FY2cCKAwQwnKM4rb-6K4TMcHuACepbPv_Cmj9E4v-O4phDSbOgTHP5o8H-t2CcOq0EQJe2nd4WIZdRey7obhx_t85RnxwmpYJQ6Z5dXeKH46Pp_asQapfhjnfP3gNtqpT4v_1PgNZFxGyGsAkhSyGbb4xqu3KLOupapM74nhrjx2vCVBPnLE7yvfeCpA0bJoWFjg3zGeAEZXfG5cvVxA';

function createTestLead() {
  const leadData = {
    name: 'Test Lead RealtyMatch',
    pipeline_id: 10946759,
    status_id: 83958267,
    responsible_user_id: 12799707
  };

  const postData = JSON.stringify([leadData]);

  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/leads',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Status Code:', res.statusCode);
      console.log('Response:', data);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          const result = JSON.parse(data);
          console.log('\n✅ Lead créé avec succès dans Kommo !');
          if (result._embedded && result._embedded.leads && result._embedded.leads[0]) {
            console.log('📋 Lead ID:', result._embedded.leads[0].id);
            console.log('📋 Lead Name:', result._embedded.leads[0].name);
          }
        } catch (error) {
          console.error('❌ Erreur parsing:', error.message);
        }
      } else {
        console.log('\n❌ Erreur lors de la création du lead');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.write(postData);
  req.end();
}

console.log('🧪 Test création lead dans Kommo...');
createTestLead();
