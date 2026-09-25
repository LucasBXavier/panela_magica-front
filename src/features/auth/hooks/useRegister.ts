"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { authService } from "../services/auth.service";
import type { RegisterInput } from "../types";

export function useRegister() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(input: RegisterInput) {
    setPending(true);
    setError(null);
    try {
      await authService.register(input);
      router.push("/login");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar a conta. Tente novamente.");
      setPending(false);
    }
  }

  return { register, pending, error };
}
