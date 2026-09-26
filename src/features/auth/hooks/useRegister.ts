"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import { authService } from "../services/auth.service";
import type { RegisterInput } from "../types";

export function useRegister() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function register(input: RegisterInput) {
    setPending(true);
    try {
      await authService.register(input);
      toastSuccess("Conta criada", "Agora é só entrar com seu e-mail e senha.");
      router.push("/login");
    } catch (err) {
      toastError(err, "Não foi possível criar a conta. Tente novamente.", "Não foi possível criar a conta");
      setPending(false);
    }
  }

  return { register, pending };
}
