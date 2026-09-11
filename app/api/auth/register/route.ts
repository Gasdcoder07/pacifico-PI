import { NextResponse } from 'next/server';
import { apiError, checkOrigin, HttpError, requireRoles } from '@/lib/auth';
import { canCreateRole } from '@/lib/roles';
import { authClient } from '@/lib/supabase-server';
import { pool } from '@/lib/db';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const actor = await requireRoles(1, 2);
    const { name, last_name, email, password, rol_id, branch_id } = await request.json();
    if (![name, last_name, email, password].every(v => typeof v === 'string' && v.trim()) || password.length < 8 || password.length > 1024 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Completa los datos y usa una contraseña de al menos 8 caracteres');
    if (!Number.isInteger(rol_id) || !canCreateRole(actor.rol_id, rol_id)) throw new HttpError(403, 'Solo puedes registrar roles de menor jerarquía');
    const branch = actor.rol_id === 2 ? actor.sucursal_id : branch_id;
    if (actor.rol_id === 2 && branch_id != null && branch_id !== branch) throw new HttpError(403, 'Solo puedes registrar cajeros en tu sucursal');
    if (!Number.isInteger(branch) || branch <= 0) throw new HttpError(400, 'Selecciona una sucursal válida');
    const existing = await pool.query('SELECT id FROM sucursales WHERE id = $1 AND estado = true', [branch]);
    if (!existing.rowCount) throw new HttpError(400, 'La sucursal no existe o está inactiva');
    const correo = email.trim().toLowerCase();
    if (correo === process.env.ADMIN_EMAIL?.trim().toLowerCase()) throw new HttpError(400, 'Este correo está reservado');
    const client = authClient(true);
    const { data, error } = await client.auth.admin.createUser({ email: correo, password, email_confirm: true,
      user_metadata: { nombre: name.trim(), apellido: last_name.trim(), rol_id, sucursal_id: String(branch) } });
    if (error || !data.user) throw new HttpError(400, 'No se pudo crear la cuenta. Revisa el correo y la configuración de Supabase');
    // Compatible con el trigger existente: actualiza el perfil que creó, o lo inserta si no existe.
    try {
      const result = await pool.query(`UPDATE usuarios SET nombre=$1, apellido=$2, correo=$3, rol_id=$4, sucursal_id=$5, estado=true WHERE auth_user_id=$6 RETURNING id`, [name.trim(), last_name.trim(), correo, rol_id, branch, data.user.id]);
      if (!result.rowCount) await pool.query('INSERT INTO usuarios (nombre, apellido, correo, rol_id, sucursal_id, estado, auth_user_id) VALUES ($1,$2,$3,$4,$5,true,$6)', [name.trim(), last_name.trim(), correo, rol_id, branch, data.user.id]);
    } catch {
      const rollback = await client.auth.admin.deleteUser(data.user.id);
      if (rollback.error) console.error('Requiere revisión manual: no se pudo revertir la cuenta Auth', data.user.id);
      throw new HttpError(500, 'No se pudo guardar el perfil; revisa la estructura y el trigger de usuarios');
    }
    return NextResponse.json({ message: 'Usuario registrado exitosamente' }, { status: 201 });
  } catch(error) { return apiError(error); }
}
