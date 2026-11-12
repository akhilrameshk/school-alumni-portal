import { NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { signToken, COOKIE } from '@/lib/auth';

// simple in-memory limiter (per server instance)
const attempts = new Map();

const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

// Credentials come from the environment:
//   ADMIN_USERNAME (or ADMIN_EMAIL)  +  ADMIN_PASSWORD  (simple)
//   or ADMIN_PASSWORD_HASH instead of ADMIN_PASSWORD (bcrypt hash, from `npm run hash`).
export async function POST(req) {
  // In development (npm run dev) a default login works: admin / admin123.
  // In production nothing is accepted until ADMIN_USERNAME and ADMIN_PASSWORD (or ADMIN_PASSWORD_HASH) are set.
  const dev = process.env.NODE_ENV !== 'production';
  const hash = process.env.ADMIN_PASSWORD_HASH || '';
  const user = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || (dev ? 'admin' : '')).trim();
  const plain = process.env.ADMIN_PASSWORD || (!hash && dev ? 'admin123' : '');
  if (!user || (!plain && !hash)) {
    return NextResponse.json({ error: 'Admin login is not set up. Add ADMIN_USERNAME and ADMIN_PASSWORD to .env.local and restart.' }, { status: 500 });
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const rec = attempts.get(ip) || { n: 0, t: now };
  if (now - rec.t > 15 * 60 * 1000) { rec.n = 0; rec.t = now; }
  if (rec.n >= 5) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const typedUser = String(body.username ?? body.email ?? '').trim().toLowerCase();
  const typedPass = String(body.password ?? '');
  const okUser = same(typedUser, user.toLowerCase());
  const okPass = plain ? same(typedPass, plain) : await bcrypt.compare(typedPass, hash);

  if (!(okUser && okPass)) {
    rec.n += 1;
    attempts.set(ip, rec);
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  }
  attempts.delete(ip);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, await signToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return res;
}
