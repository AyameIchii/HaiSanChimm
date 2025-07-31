const SUPABASE_URL = 'https://zwixilhhgrwhftnhgifh.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3aXhpbGhoZ3J3aGZ0bmhnaWZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MzI0MzMsImV4cCI6MjA2OTUwODQzM30.3pE8bDG67aqi3gFEG-JQu31zsJynVElFbfhOsLgFAO0'

async function saveScore(name, score) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ name, score })
  });
  return res.json();
}

async function getTopScores(limit = 10) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/scores?select=name,score&order=score.desc&limit=${limit}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  return res.json();
}
