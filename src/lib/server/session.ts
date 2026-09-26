import { cookies } from "next/headers";
import type { LoginResponse, Usuario } from "@/features/auth/types";

const TOKEN_COOKIE = "pm_token";
const REFRESH_COOKIE = "pm_refresh";
const USER_COOKIE = "pm_user";

const baseOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getToken(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

// Logado = há access token ou refresh token (o access expira em 60 min e é
// renovado sob demanda; o refresh vale 7 dias).
export async function getSession(): Promise<Usuario | null> {
  const store = await cookies();
  if (!store.get(TOKEN_COOKIE) && !store.get(REFRESH_COOKIE)) return null;
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

// Grava o par de tokens devolvido por login/refresh. Só route handlers e server actions podem escrever cookies.
export async function setSession(data: LoginResponse): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, data.token, { ...baseOptions, maxAge: data.expiresIn });
  store.set(REFRESH_COOKIE, data.refreshToken, { ...baseOptions, maxAge: data.refreshExpiresIn });
  store.set(USER_COOKIE, JSON.stringify(data.usuario), { ...baseOptions, maxAge: data.refreshExpiresIn });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(USER_COOKIE);
}
