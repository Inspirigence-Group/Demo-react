const https = require('https');

const SUBDOMAIN = 'inspirigence';
const API_KEY = 'xjlkiUNV4v3Bd4Ri88hDoBFuo9dot6rgnWMZ9C7a8KtUEOdNWp3LsQgcSW838EA3';

function getPipelineStatuses() {
  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/pipelines/12041207/statuses',
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
      
      try {
        const result = JSON.parse(data);
        console.log('\n📋 Statuts du pipeline 12041207:');
        if (result._embedded && result._embedded.statuses) {
          result._embedded.statuses.forEach(status => {
            console.log(`🔹 ID: ${status.id} - Nom: ${status.name}`);
            if (status.name.toLowerCase().includes('new') || status.name.toLowerCase().includes('lead')) {
              console.log(`   ⭐ C'est probablement le statut NEWLEADS !`);
            }
          });
        }
      } catch (error) {
        console.error('❌ Erreur parsing:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.end();
}

console.log('🔍 Recherche des statuts du pipeline 12041207...');
getPipelineStatuses();
