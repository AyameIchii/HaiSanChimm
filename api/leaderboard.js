import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const filePath = path.join(process.cwd(), 'leaderboard.json');

  try {
    // Đọc file leaderboard
    let data = [];
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(fileContent || '[]');
    }

    switch (req.method) {
      case 'GET': {
        data.sort((a, b) => b.score - a.score);
        const topScores = data.slice(0, 20);
        return res.status(200).json({ success: true, data: topScores });
      }

      case 'POST': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { name, score } = body;

        if (!name || typeof score !== 'number' || name.length > 50 || score < 0 || score > 999999) {
          return res.status(400).json({ success: false, error: 'Invalid input data' });
        }

        const entry = {
          name: name.trim().substring(0, 50),
          score: Math.floor(score),
          date: new Date().toISOString(),
          ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown'
        };

        data.push(entry);

        // Ghi lại vào file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return res.status(200).json({ success: true, message: 'Score saved successfully' });
      }

      default:
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Error in leaderboard handler:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
