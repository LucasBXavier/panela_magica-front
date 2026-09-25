// Uso exclusivo em Route Handlers / Server Components (lê API_URL, nunca vai ao browser).
import { getToken } from "./session";

// Base completa da API, incluindo o prefixo (ex.: http://localhost:8080/api/v1).
const API_URL = (process.env.API_URL ?? "http://localhost:8080/api/v1").replace(/\/+$/, "");

export async function backendFetch(
  path: string,
  init: RequestInit & { auth?: boolean } = {},
): Promise<Response> {
  const { auth = true, headers, ...rest } = init;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const token = await getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    cache: "no-store",
  });
}
