const https = require('https');

const SUBDOMAIN = 'inspirigence';
const API_KEY = 'xjlkiUNV4v3Bd4Ri88hDoBFuo9dot6rgnWMZ9C7a8KtUEOdNWp3LsQgcSW838EA3';

function getAllPipelines() {
  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/pipelines',
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
      
      try {
        const result = JSON.parse(data);
        console.log('\n📋 Tous les pipelines disponibles:');
        if (result._embedded && result._embedded.pipelines) {
          result._embedded.pipelines.forEach(pipeline => {
            console.log(`🔹 Pipeline ID: ${pipeline.id} - Nom: "${pipeline.name}"`);
            console.log(`   📝 Nombre de statuts: ${pipeline.statuses?.length || 0}`);
            
            if (pipeline.statuses) {
              pipeline.statuses.forEach(status => {
                console.log(`   └─ Status ID: ${status.id} - Nom: "${status.name}"`);
                if (status.name.toLowerCase().includes('new') || status.name.toLowerCase().includes('lead')) {
                  console.log(`       ⭐ PROBABLEMENT LE STATUT NEWLEADS !`);
                }
              });
            }
            console.log('');
          });
        } else {
          console.log('Aucun pipeline trouvé');
        }
      } catch (error) {
        console.error('❌ Erreur parsing:', error.message);
        console.log('Response brute:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur requête:', error.message);
  });

  req.end();
}

console.log('🔍 Recherche de tous les pipelines...');
getAllPipelines();
