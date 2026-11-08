import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, token, newPassword } = await request.json();

        const normalizedEmail = email.trim().toLowerCase()

        if (!email || !token || !newPassword) {
            return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
        }

        if (!/^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(newPassword)) {
            return NextResponse.json(
                { error: "La nueva contraseña no cumple con los requisitos" },
                { status: 400 }
            );
        }

        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return cookieStore.get(name)?.value; },
                    set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
                    remove(name: string, options: CookieOptions) { cookieStore.delete({ name, ...options }); },
                },
            }
        );

        const { error: verifyError } = await supabase.auth.verifyOtp({
            email: normalizedEmail,
            token,
            type: 'recovery'
        });

        if (verifyError) {
            console.error(`Verify opt error: `, {
                status: verifyError.status,
                code: verifyError.code,
                message: verifyError.message
            })
            return NextResponse.json({ error: `El código es inválido o ha expirado error` }, { status: 400 });
        }

        const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

        if (updateError) throw updateError;

        return NextResponse.json({ message: 'Contraseña actualizada correctamente' });
    } catch(err) {
        return NextResponse.json(
            { error: `Error interno en el backend` },
            { status: 500 }
        );
    }
}