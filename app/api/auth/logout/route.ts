//Mensaje y funcion pa cerrar sesión acomodada (creo)
import { NextResponse } from 'next/server';
import { COOKIE } from '@/lib/session';
import { checkOrigin, apiError } from '@/lib/auth';
export async function POST(request: Request) { 
    try { checkOrigin(request); const response = NextResponse.json({ message: 'Sesión cerrada' });
    response.cookies.set(COOKIE, '', { path: '/', maxAge: 0 }); return response; } catch(error) 
    { return apiError(error); } }
