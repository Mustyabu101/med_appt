import { neon } from '@neondatabase/serverless';
import {
  getAuthToken,
  verifyAuthToken,
} from '../../lib/authToken.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const token = getAuthToken(req);

  if (!token) {
    return res.status(200).json({
      authenticated: false,
      user: null,
    });
  }

  let payload;

  try {
    payload = verifyAuthToken(token);
  } catch (error) {
    console.warn('Invalid or expired session token:', error.name);

    return res.status(401).json({
      authenticated: false,
      user: null,
      error: 'Your session has expired. Please log in again.',
    });
  }

  const databaseUrl = process.env.NEON_POSTGRES_URL;

  if (!databaseUrl) {
    return res.status(500).json({
      error: 'Database connection is not configured.',
    });
  }

  try {
    const sql = neon(databaseUrl);

    const users = await sql`
      SELECT id, name, email, phone, role
      FROM users
      WHERE id = ${payload.sub}
      LIMIT 1
    `;

    if (!users.length) {
      return res.status(401).json({
        authenticated: false,
        user: null,
        error: 'User account no longer exists.',
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: users[0],
    });
  } catch (error) {
    console.error('Session database error:', error);

    return res.status(500).json({
      error: 'Unable to verify your session. Please try again.',
    });
  }
}
