import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Checagem otimista: só verifica se há cookie de sessão. A autorização real
// acontece nas páginas (getSession) e no backend (token).
export function proxy(request: NextRequest) {
  if (request.cookies.has("pm_token")) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const next = `${pathname}${search}`;

  // Access token expirou (60 min) mas ainda há refresh token: renova e volta.
  if (request.cookies.has("pm_refresh")) {
    const refresh = new URL("/api/auth/refresh", request.url);
    refresh.searchParams.set("next", next);
    return NextResponse.redirect(refresh);
  }

  const login = new URL("/login", request.url);
  login.searchParams.set("next", next);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"],
};
