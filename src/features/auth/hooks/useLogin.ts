"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { authService } from "../services/auth.service";
import type { LoginInput } from "../types";

// Só aceita caminhos internos, para evitar open redirect.
function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export function useLogin(next?: string) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(input: LoginInput) {
    setPending(true);
    setError(null);
    try {
      await authService.login(input);
      router.push(safeNext(next));
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
      setPending(false);
    }
  }

  return { login, pending, error };
}
