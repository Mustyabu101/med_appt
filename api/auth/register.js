import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  const databaseUrl = process.env.NEON_POSTGRES_URL;

  if (!databaseUrl) {
    return res.status(500).json({
      error: 'Database connection is not configured.',
    });
  }

  try {
    const {
      name,
      email,
      phone = '',
      password,
    } = req.body ?? {};

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      password.length < 8
    ) {
      return res.status(400).json({
        error: 'Provide a name, valid email and password of at least 8 characters.',
      });
    }

    if (typeof phone !== 'string') {
      return res.status(400).json({
        error: 'Invalid phone number.',
      });
    }

    const sql = neon(databaseUrl);

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT DEFAULT '',
        role TEXT NOT NULL DEFAULT 'Patient',
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    const rows = await sql`
      INSERT INTO users (
        name,
        email,
        phone,
        role,
        password_hash
      )
      VALUES (
        ${name.trim()},
        ${normalizedEmail},
        ${phone.trim()},
        'Patient',
        ${passwordHash}
      )
      ON CONFLICT (email) DO NOTHING
      RETURNING id, name, email, phone, role, created_at
    `;

    if (!rows.length) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    return res.status(201).json({
      message: 'Patient account registered successfully. Please log in.',
      user: rows[0],
    });
  } catch (error) {
    console.error('Registration error:', error);

    return res.status(500).json({
      error: 'Registration failed. Please try again later.',
    });
  }
}
