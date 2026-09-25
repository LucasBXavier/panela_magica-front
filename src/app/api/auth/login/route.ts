import { backendFetch } from "@/lib/server/backend";
import { setSession } from "@/lib/server/session";
import type { LoginResponse } from "@/features/auth/types";

export async function POST(request: Request) {
  const res = await backendFetch("/usuarios/login", {
    method: "POST",
    auth: false,
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });

  const text = await res.text();
  if (!res.ok) {
    return new Response(text, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "text/plain" },
    });
  }

  const { data } = JSON.parse(text) as { data: LoginResponse };
  await setSession(data.token, data.usuario, data.expiresIn);

  // O token nunca sai do servidor: o browser só recebe o usuário.
  return Response.json({ data: { usuario: data.usuario } });
}
