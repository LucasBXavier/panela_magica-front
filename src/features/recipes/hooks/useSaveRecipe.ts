"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api";
import { toastError, toastSuccess, toastWarning } from "@/lib/toast";
import { recipesService, type CreateRecipeInput, type UpdateRecipeInput } from "../services/recipes.service";

// Cria a receita, ou edita quando recebe o id.
export function useSaveRecipe(id?: string) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  // Receita já criada nesta tela: um novo envio vira edição, sem duplicar.
  const [createdId, setCreatedId] = useState<string | null>(null);

  async function save(input: CreateRecipeInput | UpdateRecipeInput, image?: File | null, removeImage = false) {
    setPending(true);
    let savedId = id ?? createdId;
    try {
      if (savedId) {
        if (Object.keys(input).length > 0) await recipesService.update(savedId, input);
      } else {
        savedId = (await recipesService.create(input as CreateRecipeInput)).id;
        setCreatedId(savedId);
      }
    } catch (err) {
      toastError(err, "Não foi possível salvar a receita. Tente novamente.", "Não foi possível salvar");
      setPending(false);
      return;
    }

    try {
      if (image) await recipesService.uploadImage(savedId, image);
      else if (removeImage) await recipesService.removeImage(savedId);
      toastSuccess(id ? "Receita atualizada" : "Receita criada");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const reason = err instanceof ApiError ? err.message : "tente novamente.";
      toastWarning("Receita salva, mas a imagem não foi atualizada", reason);
      setPending(false);
    }
  }

  return { save, pending };
}
