export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ⚠️ Đây là dummy storage, sẽ mất mỗi lần reload
  // Muốn thật thì phải lưu vào file/database
  global.leaderboard = global.leaderboard || [];

  try {
    if (req.method === 'GET') {
      const sorted = [...global.leaderboard].sort((a, b) => b.score - a.score);
      const top20 = sorted.slice(0, 20);
      return res.status(200).json({ success: true, data: top20 });
    }

    if (req.method === 'POST') {
      const body = req.body;

      // Nếu body không được parse sẵn, dùng:
      // const body = JSON.parse(await streamToString(req));

      const { name, score } = body;

      if (!name || typeof score !== 'number' || name.length > 50 || score < 0 || score > 999999) {
        return res.status(400).json({ success: false, error: 'Invalid input' });
      }

      global.leaderboard.push({
        name: name.trim().substring(0, 50),
        score: Math.floor(score),
        date: new Date().toISOString()
      });

      return res.status(200).json({ success: true, message: 'Score saved' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
