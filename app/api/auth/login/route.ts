import { NextResponse } from 'next/server';
import { apiError, checkOrigin, HttpError, profileFields } from '@/lib/auth';
import { COOKIE, MAX_AGE, equalSecret, signSession } from '@/lib/session';
import { authClient } from '@/lib/supabase-server';
export async function POST(request: Request) {
  
  try {
    checkOrigin(request);
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = body.password;
    if (!email || typeof password !== 'string' || !password || password.length > 1024) throw new HttpError(400, 'Escribe correo y contraseña');
    let usuario;
    let token;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (adminEmail && email === adminEmail) {
      if (!process.env.ADMIN_PASSWORD || !equalSecret(password, process.env.ADMIN_PASSWORD)) throw new HttpError(401, 'Credenciales incorrectas');
      usuario = { id: 0, nombre: 'ADMIN', apellido: '', correo: email, rol_id: 1, sucursal_id: null, estado: true };
      token = signSession({ sub: email, kind: 'admin' });
    } else {
      const { data, error } = await authClient().auth.signInWithPassword({ email, password });
      if (error || !data.user) throw new HttpError(401, 'Credenciales incorrectas');
      const { pool } = await import('@/lib/db');
      const { rows } = await pool.query(`SELECT ${profileFields} FROM usuarios WHERE auth_user_id = $1`, [data.user.id]);
      
      usuario = rows[0];
      if (usuario) {usuario.rol_id = Number(usuario.rol_id);}
      if (!usuario || !usuario.estado || ![2, 3].includes(usuario.rol_id)) {
        throw new HttpError(403, "Cuenta inactiva o rol no permitido");
      }
      token = signSession({ sub: data.user.id, kind: 'staff' });
    }
    const response = NextResponse.json({ usuario });
    response.cookies.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: MAX_AGE });
    return response;
  } catch (error) { return apiError(error); }
}
