import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Checagem otimista: só verifica se há cookie de sessão. A autorização real
// acontece nas páginas (getSession) e no backend (token).
export function proxy(request: NextRequest) {
  if (request.cookies.has("pm_token")) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  const login = new URL("/login", request.url);
  login.searchParams.set("next", `${pathname}${search}`);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/:path*", "/perfil/:path*"],
};
