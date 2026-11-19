import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'stayhealthy_session';
const TOKEN_EXPIRY = '1h';
const ISSUER = 'stayhealthy';

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.');
  }

  return secret;
}

export function createAuthToken(user) {
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    getSecret(),
    {
      subject: String(user.id),
      issuer: ISSUER,
      expiresIn: TOKEN_EXPIRY,
      algorithm: 'HS256',
    }
  );
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getSecret(), {
    issuer: ISSUER,
    algorithms: ['HS256'],
  });
}

export function setAuthCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`
  );
}

export function clearAuthCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`
  );
}

export function getAuthToken(req) {
  const cookieHeader = req.headers.cookie || '';

  const cookies = cookieHeader.split(';');

  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${COOKIE_NAME}=`)
  );

  if (!authCookie) return null;

  return authCookie.trim().slice(COOKIE_NAME.length + 1);
}
