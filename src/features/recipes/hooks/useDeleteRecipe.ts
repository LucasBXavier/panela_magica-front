"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import { recipesService } from "../services/recipes.service";

export function useDeleteRecipe() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function remove(id: string): Promise<boolean> {
    setPending(true);
    try {
      await recipesService.remove(id);
      toastSuccess("Receita excluída");
      router.refresh();
      return true;
    } catch (err) {
      toastError(err, "Não foi possível excluir a receita. Tente novamente.", "Não foi possível excluir");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { remove, pending };
}
