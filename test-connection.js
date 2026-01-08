const https = require('https');

const SUBDOMAIN = 'inspirigence';
const API_KEY = 'NOUVEAU_TOKEN_GENEREDV6sbDrxyUW37B5jMbfLwNzBp7.eyJhdWQiOiIyYmUwM2YxYy0yM2U3LTQwNWEtYmIzYy0yYThhMThlZTcwYWEiLCJqdGkiOiI1OWJkNGFlZGQ3ZDhlNWVmZDM0OWFkYTA0YjMyNDEyOTJkNWFjZWNlMDJiN2YwNjBjZDQ5YjE1NTVlODFkNDFjM2FlZTc4ZDRhNThjYTQyNyIsImlhdCI6MTc2Nzg4ODY5MSwibmJmIjoxNzY3ODg4NjkxLCJleHAiOjE4OTQwNjA4MDAsInN1YiI6IjEyNzk5NzA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0NDU2NzM5LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMmRjNTQ3YmItNzYzNC00MGU2LTk3MjctNmMyOTExYzU1OTk1IiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.RygsvxsZ-2lYM6361IGx6hSFeFb46_UOPf9t4KKT6vNcAY2jA0umM5cUn5Z_AvSW5eJb-1Zu3-OA6G-ybJNIRO5ahCX7bTsuruW295e3rSCjO9TYsKVS2Mbnl7N-V6wTKNRCZJ9TozwIIRGqTQT7wQZV2HcSsT79n5Hf29Z4UV9TsyQjEEsaJkO6LPrRFodgrpnnkQNcDK8G7R8sfuhs54MwGk7Q4mTlv_LSv1wiUKHyNsztBILsC4Bbmd98dtRTxeBLo1tU3Oqfp57yhEq60qZVGIG5CogRuncV8Fl2DTxjcPniYyTYkE62Jale9AbHQSlGcen3ObBua4...[8 bytes truncated]';

function testConnection() {
  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/account',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
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
      
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(data);
          console.log('\n✅ Connexion réussie !');
          console.log('📋 Compte:', result.name || result.id);
          console.log('📧 Email:', result.email);
        } catch (error) {
          console.error('❌ Erreur parsing:', error.message);
        }
      } else {
        console.log('\n❌ Erreur de connexion');
        console.log('Vérifie:');
        console.log('1. Le subdomain est correct');
        console.log('2. La clé API est valide');
        console.log('3. L intégration a les permissions nécessaires');
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.end();
}

console.log('🔍 Test de connexion à Kommo...');
testConnection();
