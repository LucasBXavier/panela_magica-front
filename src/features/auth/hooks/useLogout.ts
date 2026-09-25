"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";

export function useLogout() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await authService.logout();
    } finally {
      router.push("/");
      router.refresh();
      setPending(false);
    }
  }

  return { logout, pending };
}
