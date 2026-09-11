//Este endpoint devuelve los roles que el usuario actual tiene permitido registrar.
//Si entra el ADMIN, devuelve gerente y cajero.
//Si entra un gerente, devuelve solamente cajero.
//Si entra un cajero, rechaza la petición porque no puede registrar usuarios.
import { NextResponse } from 'next/server';
import { requireRoles, apiError } from '@/lib/auth';
import { canCreateRole } from '@/lib/roles';
export async function GET() { 
    try { const actor = await requireRoles(1,2); 
        return NextResponse.json({ data: [{id:2,nombre:'Gerente'},
            {id:3,nombre:'Cajero'}].filter(r => canCreateRole(actor.rol_id,r.id)) });
        } catch(error) { return apiError(error); } }
