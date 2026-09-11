import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { COOKIE, verifySession } from './session';
import { ROLES } from './roles';
import type { UserProfile } from '@/types/authInterfaces';

export class HttpError extends Error {
  constructor(public status: number, message: string) 
  { super(message); } }

export function apiError(error: unknown) {
  return NextResponse.json({ error: error instanceof HttpError ? error.message : 'Error interno del servidor' },
    { status: error instanceof HttpError ? error.status : error instanceof SyntaxError ? 400 : 500 });
}

export const profileFields = 'id, nombre, apellido, correo, rol_id, sucursal_id, estado';

export async function currentUser(): Promise<UserProfile> {

  const token = (await cookies()).get(COOKIE)?.value;
  const session = token ? verifySession(token) : null;
  if (!session) throw new HttpError(401, 'Inicia sesión nuevamente');
  if (session.kind === 'admin') return { id: 0, nombre: 'ADMIN', apellido: '', correo: session.sub, rol_id: ROLES.ADMIN, sucursal_id: null, estado: true };
  const { pool } = await import('./db');
  const { rows } = await pool.query(`SELECT ${profileFields} FROM usuarios WHERE auth_user_id = $1`, [session.sub]);
  const user = rows[0];
  //el rol lo estaba agregando/buscando como string pero en la db se agregó como int entonces cambiamos
  // a valor numerico para que no de errores ayuda si jaló si alguien lee esto ayuda por favor
  if (user) {user.rol_id = Number(user.rol_id);}
  if (!user || !user.estado || ![ROLES.GERENTE, ROLES.CAJERO].includes(user.rol_id)) throw new HttpError(403, 'Cuenta inactiva o rol no permitido');
  return user;
}

export async function requireRoles(...roles: number[]) {
  const user = await currentUser();
  if (!roles.includes(user.rol_id)) throw new HttpError(403, 'No tienes permiso para esta acción');
  return user;
}

export function checkOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, 'Origen no permitido');
}
