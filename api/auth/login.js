import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import {
  createAuthToken,
  setAuthCookie,
} from '../../lib/authToken.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const databaseUrl = process.env.NEON_POSTGRES_URL;

  if (!databaseUrl) {
    return res.status(500).json({
      error: 'Database connection is not configured',
    });
  }

  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Email and password are required.',
      });
    }

    const sql = neon(databaseUrl);

    const users = await sql`
      SELECT id, name, email, phone, role, password_hash
      FROM users
      WHERE email = ${email.trim().toLowerCase()}
      LIMIT 1
    `;

    if (
      !users.length ||
      !(await bcrypt.compare(password, users[0].password_hash))
    ) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    const {
      password_hash: passwordHash,
      ...user
    } = users[0];

    void passwordHash;

    const token = createAuthToken(user);

    setAuthCookie(res, token);

    return res.status(200).json({
      message: 'Login successful.',
      user,
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      error: 'Login failed. Check server configuration.',
    });
  }
}
