import { cookies } from "next/headers";
import type { Usuario } from "@/features/auth/types";

const TOKEN_COOKIE = "pm_token";
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

export async function getSession(): Promise<Usuario | null> {
  const store = await cookies();
  if (!store.get(TOKEN_COOKIE)) return null;
  const raw = store.get(USER_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export async function setSession(token: string, usuario: Usuario, expiresIn: number): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE, token, { ...baseOptions, maxAge: expiresIn });
  store.set(USER_COOKIE, JSON.stringify(usuario), { ...baseOptions, maxAge: expiresIn });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE);
  store.delete(USER_COOKIE);
}
