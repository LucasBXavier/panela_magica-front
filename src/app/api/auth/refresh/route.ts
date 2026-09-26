import { NextResponse, type NextRequest } from "next/server";
import { refreshSession } from "@/lib/server/backend";

export const dynamic = "force-dynamic";

// Usado pelo proxy de páginas: renova o par de tokens (o access dura 60 min) e volta
// para a página pedida. Sem refresh válido, manda para o login.
export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (await refreshSession()) return NextResponse.redirect(new URL(safeNext, request.url));

  const login = new URL("/login", request.url);
  login.searchParams.set("next", safeNext);
  return NextResponse.redirect(login);
}
