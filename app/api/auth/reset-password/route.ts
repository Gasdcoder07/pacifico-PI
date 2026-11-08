import { CookieOptions, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const { newPassword } = await request.json()

        if (!newPassword || /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(newPassword) === false) {
            return NextResponse.json(
                { error: "La nueva contraseña no cumple con los requisitos" },
                { status: 400 }
            )
        }

        const cookieStore = await cookies()
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

        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json(
                { error: 'La sesión de recuperación no es válida o ha expirado' },
                { status: 401 }
            );
        }

        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) throw error

        return NextResponse.json(
            { message: 'Contraseña actualizada correctamente' }
        )
    } catch(err) {
        return NextResponse.json(
            { error: `Error interno en el backend ${err}` },
            { status: 500 }
        )
    }
}