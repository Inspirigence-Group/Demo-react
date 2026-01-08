const https = require('https');

const SUBDOMAIN = 'inspirigence';
const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImFjOWE1ZjVjZWJjMDMwZGFhM2I1NGE2NjY1OTk1NmZlMDBjZjEwOGE1ODE0MjFmMjY3MTRiZmExNzY2YWU0YjAwZjFlZmZjNjcyNzRkNmI2In0.eyJhdWQiOiIyYmUwM2YxYy0yM2U3LTQwNWEtYmIzYy0yYThhMThlZTcwYWEiLCJqdGkiOiJhYzlhNWY1Y2ViYzAzMGRhYTNiNTRhNjY2NTk5NTZmZTAwY2YxMDhhNTgxNDIxZjI2NzE0YmZhMTc2NmFlNGIwMGYxZWZmYzY3Mjc0ZDZiNiIsImlhdCI6MTc2Nzg4ODgyMiwibmJmIjoxNzY3ODg4ODIyLCJleHAiOjE4OTQwNjA4MDAsInN1YiI6IjEyNzk5NzA3IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjM0NDU2NzM5LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiNTg5MTc4ZDAtMTk2My00NzI5LWI3ODctYmFhYWUyYWExOWFjIiwidXNlcl9mbGFncyI6MCwiYXBpX2RvbWFpbiI6ImFwaS1jLmtvbW1vLmNvbSJ9.MgA2Ud5O44dNQS9p69FZdCJtWtD9aD6_Tq5KAgjQd2OqPry00NnO48ObDrjjNu0d9m4M437ly8Uby25IQMxUCl81r4iC-X6cHG4xi39XI_nK_nVg_SP68g84GIqpzQ3428FY2cCKAwQwnKM4rb-6K4TMcHuACepbPv_Cmj9E4v-O4phDSbOgTHP5o8H-t2CcOq0EQJe2nd4WIZdRey7obhx_t85RnxwmpYJQ6Z5dXeKH46Pp_asQapfhjnfP3gNtqpT4v_1PgNZFxGyGsAkhSyGbb4xqu3KLOupapM74nhrjx2vCVBPnLE7yvfeCpA0bJoWFjg3zGeAEZXfG5cvVxA';

const pipelineIds = [11303007, 10946759, 11103483, 11734495, 11772435];

function checkPipeline(pipelineId) {
  return new Promise((resolve) => {
    const options = {
      hostname: `${SUBDOMAIN}.kommo.com`,
      path: `/api/v4/leads/pipelines/${pipelineId}/statuses`,
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
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log(`\n📋 Pipeline ${pipelineId}:`);
            if (result._embedded && result._embedded.statuses) {
              result._embedded.statuses.forEach(status => {
                console.log(`   └─ Status ID: ${status.id} - Nom: "${status.name}"`);
              });
            }
          } catch (error) {
            console.log(`❌ Pipeline ${pipelineId}: Erreur parsing`);
          }
        } else {
          console.log(`❌ Pipeline ${pipelineId}: Status ${res.statusCode}`);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Pipeline ${pipelineId}: Erreur requête`);
      resolve();
    });

    req.end();
  });
}

async function checkAllPipelines() {
  console.log('🔍 Recherche du pipeline "P1 - ACQUISITION"...');
  
  for (const pipelineId of pipelineIds) {
    await checkPipeline(pipelineId);
  }
  
  console.log('\n💡 Cherche le pipeline qui contient "ACQUISITION" ou "P1" dans les noms de statuts');
}

checkAllPipelines();
