import jwt from 'jsonwebtoken';
import { createHash, timingSafeEqual } from 'node:crypto';
export const COOKIE = 'pacifico_session';
export const MAX_AGE = 60 * 60 * 8;
export interface Session { sub: string; kind: 'admin' | 'staff' }
function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('Configura AUTH_SECRET con al menos 32 caracteres');
  return value;
}
export function equalSecret(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
export function signSession(session: Session) {
  return jwt.sign(session, secret(), { algorithm: 'HS256', expiresIn: MAX_AGE, issuer: 'pacifico', audience: 'pacifico-web' });
}
export function verifySession(token: string): Session | null {
  try {
    const data = jwt.verify(token, secret(), { algorithms: ['HS256'], issuer: 'pacifico', audience: 'pacifico-web' });
    if (typeof data === 'string' || typeof data.sub !== 'string' || !['admin', 'staff'].includes(data.kind)) return null;
    if (data.kind === 'admin' && data.sub !== process.env.ADMIN_EMAIL?.trim().toLowerCase()) return null;
    return { sub: data.sub, kind: data.kind };
  } catch { return null; }
}
