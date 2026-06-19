const router = require('express').Router();
const { getDb } = require('../config/db');
const redisClient = require('../config/redis');

router.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    // Check Redis first
    const cached = await redisClient.get(code);
    if (cached) {
      console.log('⚡ Redis cache hit');
      return res.redirect(cached);
    }

    // Query database
    const db = await getDb();
    const result = db.exec(`SELECT * FROM urls WHERE short_code = '${code}'`);

    if (!result.length) return res.status(404).json({ error: 'URL not found' });

    const row = result[0].values[0];
    const original_url = row[2];
    const url_id = row[0];

    // Save to Redis
    await redisClient.setEx(code, 86400, original_url);

    // Save analytics
    db.run(`INSERT INTO analytics (url_id, ip_address, user_agent) VALUES (?, ?, ?)`,
      [url_id, req.ip, req.headers['user-agent']]
    );

    res.redirect(original_url);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;