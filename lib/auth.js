import { SignJWT, jwtVerify } from 'jose';

export const COOKIE = 'admin_token';
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-only-secret-change-me' : ''));

export async function signToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function verifyToken(token) {
  try {
    await jwtVerify(token, secret());
    return true;
  } catch {
    return false;
  }
}
