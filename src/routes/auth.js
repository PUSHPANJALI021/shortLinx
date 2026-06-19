const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    const hashed = await bcrypt.hash(password, 10);
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashed]);
    res.json({ message: '✅ User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const db = await getDb();
    const result = db.exec(`SELECT * FROM users WHERE email = '${email}'`);
    if (!result.length) return res.status(401).json({ error: 'User not found' });

    const row = result[0].values[0];
    const user = {
      id: row[0],
      email: row[1],
      password: row[2]
    };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;