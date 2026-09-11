//Este endpoint obtiene los datos del usuario que tiene la sesión iniciada.
//Verifica la cookie y devuelve el perfil del ADMIN, gerente o cajero.
import { NextResponse } from 'next/server';
import { currentUser, apiError } from '@/lib/auth';
export async function GET() { 
    try { return NextResponse.json({ data: await currentUser() }, 
    { headers: { 'Cache-Control': 'no-store' } }); } catch (error) { return apiError(error); } }
