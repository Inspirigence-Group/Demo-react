const https = require('https');

// Remplace ces valeurs par tes identifiants Kommo
const SUBDOMAIN = 'inspirigence'; // ex: 'ma-societe'
const API_KEY = 'xjlkiUNV4v3Bd4Ri88hDoBFuo9dot6rgnWMZ9C7a8KtUEOdNWp3LsQgcSW838EA3';

// Fonction pour récupérer les pipelines
function getPipelines() {
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
      try {
        const result = JSON.parse(data);
        console.log('📋 Pipelines disponibles:');
        if (result._embedded && result._embedded.pipelines) {
          result._embedded.pipelines.forEach(pipeline => {
            console.log(`🔹 ID: ${pipeline.id} - Nom: ${pipeline.name}`);
            if (pipeline.statuses) {
              console.log('   Statuts disponibles:');
              pipeline.statuses.forEach(status => {
                console.log(`   └─ ID: ${status.id} - Nom: ${status.name}`);
              });
            }
            console.log('');
          });
        }
      } catch (error) {
        console.error('❌ Erreur:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error.message);
  });

  req.end();
}

// Fonction pour récupérer les utilisateurs
function getUsers() {
  const options = {
    hostname: `${SUBDOMAIN}.kommo.com`,
    path: '/api/v4/users',
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
      try {
        const result = JSON.parse(data);
        console.log('👥 Utilisateurs disponibles:');
        if (result._embedded && result._embedded.users) {
          result._embedded.users.forEach(user => {
            console.log(`🔹 ID: ${user.id} - Nom: ${user.name} - Email: ${user.email}`);
          });
        }
      } catch (error) {
        console.error('❌ Erreur:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erreur de requête:', error.message);
  });

  req.end();
}

console.log('🔍 Récupération des IDs Kommo...');
console.log('================================');

getPipelines();
console.log('================================');
getUsers();
