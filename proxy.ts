/*Primero revisa si el usuario tiene una sesión válida mediante currentUser().
IMPORTANTE!!!!!!
Después aplica los permisos:
Si no hay sesión, lo manda a /login.
Si el usuario intenta entrar a una página que su rol no permite, lo manda a /sales.
Si tiene permiso, deja que continúe.
/login siempre queda disponible.
El matcher indica cuáles rutas debe vigilar el proxy, como usuarios, ventas, inventario, configuración y punto de venta.

Antes tenía:
const isAuth = true;
Eso hacía que el sistema considerara a todos autenticados. Ahora verifica la sesión y el rol real del usuario. Así, aunque alguien escriba directamente /usuarios en el navegador, el proxy bloquea el acceso si es cajero.
*/
import { NextResponse, type NextRequest } from 'next/server';
import { currentUser } from '@/lib/auth';
import { canAccessPage } from '@/lib/roles';

export async function proxy(request: NextRequest) {
        const path = request.nextUrl.pathname;
    if (path === '/login') return NextResponse.next();
    try {
        const user = await currentUser();
        if (!canAccessPage(user.rol_id, path)) return NextResponse.redirect(new URL('/sales', request.url));
        return NextResponse.next();
    } catch { return NextResponse.redirect(new URL('/login', request.url)); }
}

export const config = { matcher: ['/', '/register', '/test-register', '/test-login', '/pos/:path*', '/sales/:path*', '/usuarios/:path*', '/inventory/:path*', '/dashboard/:path*', '/settings/:path*', '/api/api-docs'] };
