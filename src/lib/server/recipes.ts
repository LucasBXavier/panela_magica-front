import { backendFetch } from "./backend";
import type { Receita } from "@/lib/recipes";

// GET /api/v1/receitas e /receitas/{id} são públicas (sem token).
export async function getRecipes(): Promise<Receita[]> {
  try {
    const res = await backendFetch("/receitas", { auth: false });
    if (!res.ok) return [];
    const { data } = (await res.json()) as { data: Receita[] | null };
    return data ?? [];
  } catch {
    return []; // backend fora do ar: a página mostra o estado vazio
  }
}

// GET /usuarios/me/receitas exige token: só devolve as receitas do usuário logado.
export async function getMyRecipes(): Promise<Receita[]> {
  try {
    const res = await backendFetch("/usuarios/me/receitas");
    if (!res.ok) {
      console.error(`[getMyRecipes] ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return [];
    }
    const { data } = (await res.json()) as { data: Receita[] | null };
    return data ?? [];
  } catch (err) {
    console.error("[getMyRecipes] falha ao chamar o backend:", err);
    return [];
  }
}

// Só devolve a receita se ela pertencer ao usuário logado (bloqueia edição de receita alheia).
export async function getMyRecipeById(id: string): Promise<Receita | null> {
  const mine = await getMyRecipes();
  return mine.find((recipe) => recipe.id === id) ?? null;
}

export async function getRecipeById(id: string): Promise<Receita | null> {
  try {
    const res = await backendFetch(`/receitas/${encodeURIComponent(id)}`, { auth: false });
    if (!res.ok) return null;
    const { data } = (await res.json()) as { data: Receita | null };
    return data;
  } catch {
    return null;
  }
}
