import { api } from "@/lib/api";
import type { Categoria, Ingrediente, Receita } from "@/lib/recipes";

export interface CreateRecipeInput {
  nome: string;
  descricao: string;
  ingredientes: Ingrediente[];
  modoPreparo: string;
  tempoPreparo: string;
  rendimento: string;
  categoria: Categoria;
}

// A API aceita atualização parcial: só os campos enviados mudam.
export type UpdateRecipeInput = Partial<CreateRecipeInput>;

// Rotas protegidas: o proxy /api injeta o token do cookie de sessão.
export const recipesService = {
  create: (input: CreateRecipeInput) => api.post<Receita>("/receitas", input),
  update: (id: string, input: UpdateRecipeInput) => api.patch<Receita>(`/receitas/${id}`, input),
  // Só o dono pode enviar; substitui a imagem anterior. Devolve o caminho da imagem.
  uploadImage: (receitaId: string, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.put<string>(`/receitas/${receitaId}/imagem`, form);
  },
  removeImage: (receitaId: string) => api.delete<null>(`/receitas/${receitaId}/imagem`),
  remove: (id: string) => api.delete<null>(`/receitas/${id}`),
};
