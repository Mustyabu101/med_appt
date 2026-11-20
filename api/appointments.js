import { neon } from '@neondatabase/serverless';
import {
  getAuthToken,
  verifyAuthToken,
} from '../lib/authToken.js';

const doctors = {
  'Dr. Sarah Johnson': 'General Physician',
  'Dr. Michael Brown': 'Cardiologist',
  'Dr. Emily Davis': 'Dermatologist',
  'Dr. James Wilson': 'Pediatrician',
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!['GET', 'POST', 'DELETE'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Please log in.' });
  }

  let payload;
  try {
    payload = verifyAuthToken(token);
  } catch {
    return res.status(401).json({
      error: 'Session expired. Please log in again.',
    });
  }

  if (!/^[1-9]\d*$/.test(String(payload.sub || ''))) {
    return res.status(401).json({ error: 'Invalid session.' });
  }

  const databaseUrl = process.env.NEON_POSTGRES_URL;
  if (!databaseUrl) {
    return res.status(500).json({
      error: 'Database is not configured.',
    });
  }

  try {
    const sql = neon(databaseUrl);

    const users = await sql`
      SELECT id, role
      FROM users
      WHERE id = ${payload.sub}
      LIMIT 1
    `;

    if (!users.length || users[0].role !== 'Patient') {
      return res.status(403).json({
        error: 'A valid patient account is required.',
      });
    }

    // Initialises a simple appointment-request table.
    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        patient_id BIGINT NOT NULL REFERENCES users(id)
          ON DELETE CASCADE,
        doctor_name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        phone TEXT NOT NULL,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'requested',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT
          id, doctor_name, specialty, phone,
          appointment_date, appointment_time,
          status, created_at
        FROM appointments
        WHERE patient_id = ${payload.sub}
        ORDER BY appointment_date, appointment_time, id
      `;

      return res.status(200).json({ appointments: rows });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string'
        ? JSON.parse(req.body)
        : req.body || {};

      const doctorName = String(body.doctorName || '').trim();
      const phone = String(body.phone || '').trim();
      const date = String(body.date || '').trim();
      const time = String(body.time || '').trim();

      if (!Object.hasOwn(doctors, doctorName)) {
        return res.status(400).json({
          error: 'Choose a doctor from the sample directory.',
        });
      }

      if (phone.length < 7 || phone.length > 30) {
        return res.status(400).json({
          error: 'Enter a valid contact phone number.',
        });
      }

      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !/^\d{2}:\d{2}$/.test(time)
      ) {
        return res.status(400).json({
          error: 'Enter a valid appointment date and time.',
        });
      }

      const parsedDate = new Date(`${date}T00:00:00Z`);
      const validDate =
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date;

      const validTime =
        Number(time.slice(0, 2)) <= 23 &&
        Number(time.slice(3, 5)) <= 59;

      if (!validDate || !validTime) {
        return res.status(400).json({
          error: 'Invalid appointment date or time.',
        });
      }

      if (date < new Date().toISOString().slice(0, 10)) {
        return res.status(400).json({
          error: 'Choose today or a future date.',
        });
      }

      const rows = await sql`
        INSERT INTO appointments (
          patient_id, doctor_name, specialty,
          phone, appointment_date, appointment_time
        )
        VALUES (
          ${payload.sub},
          ${doctorName},
          ${doctors[doctorName]},
          ${phone},
          ${date},
          ${time}
        )
        RETURNING id
      `;

      return res.status(201).json({
        message: 'Appointment request saved.',
        id: rows[0].id,
      });
    }

    const id = String(req.query?.id || '');

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        error: 'A valid appointment ID is required.',
      });
    }

    const deleted = await sql`
      DELETE FROM appointments
      WHERE id = ${id}
        AND patient_id = ${payload.sub}
      RETURNING id
    `;

    if (!deleted.length) {
      return res.status(404).json({
        error: 'Appointment request not found.',
      });
    }

    return res.status(200).json({
      message: 'Appointment request cancelled.',
    });
  } catch (error) {
    console.error('Appointment API error:', error);

    return res.status(500).json({
      error: 'Unable to process the appointment request.',
    });
  }
}
