"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import { authService } from "../services/auth.service";
import type { LoginInput } from "../types";

// Só aceita caminhos internos, para evitar open redirect.
function safeNext(next?: string): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export function useLogin(next?: string) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function login(input: LoginInput) {
    setPending(true);
    try {
      await authService.login(input);
      toastSuccess("Bem-vindo de volta!");
      router.push(safeNext(next));
      router.refresh();
    } catch (err) {
      toastError(err, "Não foi possível entrar. Tente novamente.", "Não foi possível entrar");
      setPending(false);
    }
  }

  return { login, pending };
}
