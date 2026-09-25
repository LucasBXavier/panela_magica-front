import type { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend";
import { clearSession, getToken } from "@/lib/server/session";

export const dynamic = "force-dynamic";

// Proxy genérico: /api/<caminho> -> ${API_URL}/api/v1/<caminho>
// Injeta o Bearer do cookie httpOnly; o browser nunca vê o token.
async function proxy(request: NextRequest, ctx: RouteContext<"/api/[...path]">) {
  const { path } = await ctx.params;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const headers: Record<string, string> = {};
  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;
  const accept = request.headers.get("accept");
  if (accept) headers["Accept"] = accept;

  const hadToken = !!(await getToken());
  const res = await backendFetch(`/${path.join("/")}${request.nextUrl.search}`, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  // Token expirado/inválido: derruba a sessão local.
  if (res.status === 401 && hadToken) await clearSession();

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") ?? "text/plain" },
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
