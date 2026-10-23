import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.NEON_POSTGRES_URL) {
    return res.status(500).json({ error: 'Database connection is not configured' });
  }

  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const sql = neon(process.env.NEON_POSTGRES_URL);
    const users = await sql`
      SELECT id, name, email, role, password_hash
      FROM users
      WHERE email = ${email.trim().toLowerCase()}
      LIMIT 1
    `;

    if (!users.length || !(await bcrypt.compare(password, users[0].password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password_hash, ...user } = users[0];
    return res.status(200).json({ message: 'Login successful', user });
  } catch {
    return res.status(500).json({ error: 'Login failed. Check server configuration.' });
  }
}
