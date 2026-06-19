const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500)
  },
  disableOfflineQueue: false,
  legacyMode: false,
  RESP: 2
});

client.on('error', err => {
  // Suppress HELLO error - compatibility issue with Redis 3.x
  if (!err.message.includes('HELLO')) {
    console.error('❌ Redis error:', err.message);
  }
});

client.on('ready', () => console.log('✅ Redis ready'));

client.connect().catch(() => {});

module.exports = client;