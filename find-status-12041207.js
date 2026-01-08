// Trouver les statuts du pipeline 12041207
require('dotenv').config({ path: '.env.local' });

const https = require('https');

const SUBDOMAIN = process.env.KOMMO_SUBDOMAIN;
const API_KEY = process.env.KOMMO_API_KEY;

function getPipelineStatuses() {
  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/leads/pipelines/12041207/statuses',
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
      
      if (res.statusCode === 200) {
        try {
          const result = JSON.parse(data);
          console.log('\n📋 Statuts du pipeline P1 - ACQUISITION (12041207):');
          if (result._embedded && result._embedded.statuses) {
            result._embedded.statuses.forEach(status => {
              console.log(`   └─ Status ID: ${status.id} - Nom: "${status.name}"`);
              if (status.name.toLowerCase().includes('new') || status.name.toLowerCase().includes('incoming') || status.name.toLowerCase().includes('lead') || status.name.toLowerCase().includes('début') || status.name.toLowerCase().includes('start')) {
                console.log(`       ⭐ PROBABLEMENT LE PREMIER STATUT !`);
              }
            });
          } else {
            console.log('Aucun statut trouvé');
          }
        } catch (error) {
          console.error('❌ Erreur parsing:', error.message);
          console.log('Response brute:', data);
        }
      } else {
        console.log('❌ Erreur lors de la récupération des statuts');
        console.log('Response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.end();
}

console.log('🔍 Recherche des statuts du pipeline P1 - ACQUISITION...');
getPipelineStatuses();
