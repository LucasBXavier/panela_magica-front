"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { recipesService } from "../services/recipes.service";

export function useDeleteRecipe() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(id: string): Promise<boolean> {
    setPending(true);
    setError(null);
    try {
      await recipesService.remove(id);
      router.refresh();
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível excluir a receita. Tente novamente.");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { remove, pending, error };
}
