const router = require('express').Router();
const { getDb } = require('../config/db');
const redisClient = require('../config/redis');
const { nanoid } = require('nanoid');

// Shorten URL
router.post('/shorten', async (req, res) => {
  const { original_url } = req.body;
  if (!original_url) return res.status(400).json({ error: 'URL is required' });

  try {
    const db = await getDb();
    const short_code = nanoid(6);

    db.run(`INSERT INTO urls (original_url, short_code) VALUES (?, ?)`, [original_url, short_code]);

    // Cache in Redis
    await redisClient.setEx(short_code, 86400, original_url);

    res.json({
      short_url: `${process.env.BASE_URL}/${short_code}`,
      short_code,
      original_url
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all URLs
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const result = db.exec(`SELECT * FROM urls ORDER BY created_at DESC`);
    if (!result.length) return res.json([]);

    const cols = result[0].columns;
    const urls = result[0].values.map(row =>
      Object.fromEntries(cols.map((col, i) => [col, row[i]]))
    );
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;