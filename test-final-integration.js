// Test final avec le token du .env.local
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const SUBDOMAIN = process.env.KOMMO_SUBDOMAIN;
const API_KEY = process.env.KOMMO_API_KEY;
const PIPELINE_ID = process.env.KOMMO_PIPELINE_ID;
const STATUS_ID = process.env.KOMMO_STATUS_ID;
const USER_ID = process.env.KOMMO_RESPONSIBLE_USER_ID;

console.log('🔍 Configuration:');
console.log('Subdomain:', SUBDOMAIN);
console.log('Pipeline ID:', PIPELINE_ID);
console.log('Status ID:', STATUS_ID);
console.log('User ID:', USER_ID);
console.log('Token length:', API_KEY ? API_KEY.length : 'undefined');

if (!API_KEY || API_KEY.length < 500) {
  console.log('❌ Token trop court ou manquant');
  process.exit(1);
}

function createTestLead() {
  const leadData = {
    name: 'Test Lead P1 ACQUISITION',
    pipeline_id: parseInt(PIPELINE_ID),
    status_id: parseInt(STATUS_ID),
    responsible_user_id: parseInt(USER_ID)
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
      console.log('\nStatus Code:', res.statusCode);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        try {
          const result = JSON.parse(data);
          console.log('✅ Lead créé avec succès dans P1 - ACQUISITION !');
          if (result._embedded && result._embedded.leads && result._embedded.leads[0]) {
            console.log('📋 Lead ID:', result._embedded.leads[0].id);
            console.log('📋 Pipeline ID:', result._embedded.leads[0].pipeline_id);
            console.log('📋 Status ID:', result._embedded.leads[0].status_id);
          }
        } catch (error) {
          console.error('❌ Erreur parsing:', error.message);
          console.log('Response brute:', data);
        }
      } else {
        console.log('❌ Erreur lors de la création du lead');
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.write(postData);
  req.end();
}

console.log('\n🧪 Test création lead dans P1 - ACQUISITION...');
createTestLead();
