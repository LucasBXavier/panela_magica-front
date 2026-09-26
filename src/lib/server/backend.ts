// Uso exclusivo em Route Handlers / Server Components (lê API_URL, nunca vai ao browser).
import type { LoginResponse } from "@/features/auth/types";
import { clearSession, getRefreshToken, getToken, setSession } from "./session";

// Base completa da API, incluindo o prefixo (ex.: http://localhost:8080/api/v1).
const API_URL = (process.env.API_URL ?? "http://localhost:8080/api/v1").replace(/\/+$/, "");

export async function backendFetch(
  path: string,
  init: RequestInit & { auth?: boolean; token?: string } = {},
): Promise<Response> {
  const { auth = true, token: explicitToken, headers, ...rest } = init;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const token = explicitToken ?? (await getToken());
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });
}

// Troca o refresh token por um novo par e grava na sessão. Devolve o novo access
// token, ou null se o refresh falhou (a sessão é limpa). O backend rotaciona o
// refresh token e trata a reutilização como vazamento (revoga todas as sessões),
// então chamadas quase simultâneas com o mesmo token compartilham uma única requisição.
const inflight = new Map<string, Promise<LoginResponse | null>>();

export function refreshSession(): Promise<string | null> {
  return (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    let pending = inflight.get(refreshToken);
    if (!pending) {
      pending = doRefresh(refreshToken);
      // Mantém o resultado por alguns segundos: requisições que já saíram do browser com o
      // refresh token antigo reaproveitam o novo par em vez de reapresentar um token rotacionado.
      setTimeout(() => inflight.delete(refreshToken), 10_000).unref?.();
      inflight.set(refreshToken, pending);
    }
    const data = await pending;
    if (!data) {
      await clearSession();
      return null;
    }
    await setSession(data);
    return data.token;
  })();
}

async function doRefresh(refreshToken: string): Promise<LoginResponse | null> {
  try {
    const res = await backendFetch("/auth/refresh", {
      method: "POST",
      auth: false,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    return ((await res.json()) as { data: LoginResponse }).data;
  } catch {
    return null;
  }
}
