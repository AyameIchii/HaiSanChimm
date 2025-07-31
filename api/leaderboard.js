// Alternative JavaScript version for Vercel Edge Functions
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Simple in-memory storage (resets on cold starts)
  // In production, you'd use a database or external storage
  let leaderboard = [];

  try {
    switch (req.method) {
      case 'GET':
        // Sort by score descending and limit to top 20
        leaderboard.sort((a, b) => b.score - a.score);
        const topScores = leaderboard.slice(0, 20);
        
        res.status(200).json({
          success: true,
          data: topScores
        });
        break;
        
      case 'POST':
        const { name, score } = req.body;
        
        // Validate input
        if (!name || typeof score !== 'number' || name.length > 50 || score < 0 || score > 999999) {
          res.status(400).json({
            success: false,
            error: 'Invalid input data'
          });
          return;
        }
        
        // Add score to leaderboard
        leaderboard.push({
          name: name.trim().substring(0, 50),
          score: Math.floor(score),
          date: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });
        
        res.status(200).json({
          success: true,
          message: 'Score saved successfully'
        });
        break;
        
      default:
        res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
