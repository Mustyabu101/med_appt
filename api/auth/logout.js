import { clearAuthCookie } from '../../lib/authToken.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  clearAuthCookie(res);

  return res.status(200).json({
    message: 'Logout successful.',
  });
}
