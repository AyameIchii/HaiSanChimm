const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co'
const SUPABASE_KEY = 'YOUR_ANON_KEY'

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
