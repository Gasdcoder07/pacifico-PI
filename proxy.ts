import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { useAuth } from "./hooks/useAuth";

export function proxy(request : NextRequest) {

    const isAuth = true

    if (
        !request.nextUrl.pathname.startsWith('/login') && 
        !request.nextUrl.pathname.startsWith('/register')
    ) {
        if (!isAuth) {
            return NextResponse.redirect(new URL("/login", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};