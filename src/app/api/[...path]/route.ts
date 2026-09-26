import type { NextRequest } from "next/server";
import { backendFetch, refreshSession } from "@/lib/server/backend";
import { clearSession, getRefreshToken, getToken } from "@/lib/server/session";

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

  const body = hasBody ? await request.arrayBuffer() : undefined;
  const call = (token?: string) =>
    backendFetch(`/${path.join("/")}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body,
      token,
    });

  // Sem access token (expirou) mas com refresh: renova antes de chamar.
  let token = await getToken();
  const hadSession = !!token || !!(await getRefreshToken());
  if (!token) token = (await refreshSession()) ?? undefined;

  let res = await call(token);

  // Token recusado: tenta renovar uma vez e repete a chamada.
  if (res.status === 401 && token) {
    const renewed = await refreshSession();
    if (renewed) res = await call(renewed);
  }

  // Sem renovação possível: derruba a sessão local.
  if (res.status === 401 && hadSession) await clearSession();

  const responseHeaders: Record<string, string> = {};
  const type = res.headers.get("content-type");
  if (type) responseHeaders["Content-Type"] = type;
  const retryAfter = res.headers.get("retry-after");
  if (retryAfter) responseHeaders["Retry-After"] = retryAfter;

  // 204/304 não podem ter corpo.
  const noBody = res.status === 204 || res.status === 304;
  return new Response(noBody ? null : res.body, { status: res.status, headers: responseHeaders });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
