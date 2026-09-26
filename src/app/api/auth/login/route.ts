import { backendFetch } from "@/lib/server/backend";
import { setSession } from "@/lib/server/session";
import type { LoginResponse } from "@/features/auth/types";

export async function POST(request: Request) {
  const res = await backendFetch("/auth/login", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  const text = await res.text();
  if (!res.ok) {
    const headers: Record<string, string> = {
      "Content-Type": res.headers.get("content-type") ?? "text/plain",
    };
    // 429: repassa quando tentar de novo.
    const retryAfter = res.headers.get("retry-after");
    if (retryAfter) headers["Retry-After"] = retryAfter;
    return new Response(text, { status: res.status, headers });
  }

  const { data } = JSON.parse(text) as { data: LoginResponse };
  await setSession(data);

  // Os tokens nunca saem do servidor: o browser só recebe o usuário.
  return Response.json({ data: { usuario: data.usuario } });
}
