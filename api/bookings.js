import { Redis } from '@upstash/redis';

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

const BOOKINGS_KEY = 'bookings';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  // Disable caching for dynamic availability
  res.setHeader('Cache-Control', 'no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Strict mode: require Redis to be configured
  if (!redis) {
    return res.status(503).json({ message: 'Redis not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.' });
  }

  try {
    // Optional debug: append ?debug=1 to GET to verify connectivity
    if (req.method === 'GET' && req.url && req.url.includes('debug=1')) {
      let pingOk = false;
      try {
        // some deployments may not support ping; fallback to a harmless op
        if (typeof redis.ping === 'function') {
          const pong = await redis.ping();
          pingOk = String(pong).toLowerCase().includes('pong') || pong === 'PONG';
        } else {
          await redis.scard(BOOKINGS_KEY);
          pingOk = true;
        }
      } catch (_) {}
      return res.status(200).json({ ok: true, redisConfigured: true, pingOk });
    }

    if (req.method === 'GET') {
      // Read all bookings from a Redis set
      const members = await redis.smembers(BOOKINGS_KEY);
      const bookings = (members || [])
        .map((key) => {
          const [date, time] = String(key).split('|');
          if (!date || !time) return null;
          return { date, time };
        })
        .filter(Boolean);
      return res.status(200).json({ bookings });
    }

    if (req.method === 'POST') {
      const { date, time } = req.body || {};
      if (!date || !time) {
        return res.status(400).json({ message: 'date and time are required' });
      }
      const key = `${date}|${time}`;
      const exists = await redis.sismember(BOOKINGS_KEY, key);
      if (exists) {
        await redis.srem(BOOKINGS_KEY, key);
        return res.status(200).json({ message: 'unbooked', date, time, booked: false });
      } else {
        await redis.sadd(BOOKINGS_KEY, key);
        return res.status(200).json({ message: 'booked', date, time, booked: true });
      }
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Bookings API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: String(error && error.message ? error.message : error) });
  }
}


