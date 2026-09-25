export type Categoria = "DOCE" | "SALGADO" | "BEBIDA" | "SOBREMESA" | "OUTROS";

export type UnidadeMedida =
  | "GRAMA"
  | "QUILOGRAMA"
  | "MILILITRO"
  | "LITRO"
  | "UNIDADE"
  | "XICARA"
  | "COLHER_SOPA"
  | "COLHER_CHA"
  | "A_GOSTO";

export interface Ingrediente {
  nomeIngrediente: string;
  quantidade: number;
  unidadeMedida: UnidadeMedida;
}

// Espelha a resposta de receita da API (API_DOCUMENTATION.md)
export interface Receita {
  id: string;
  nome: string;
  descricao: string;
  ingredientes: Ingrediente[];
  modoPreparo: string;
  tempoPreparo: string;
  rendimento: string;
  categoria: Categoria;
  imagemUrl: string | null;
  dataCriacao: string;
}

export const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: "DOCE", label: "Doces" },
  { value: "SALGADO", label: "Salgados" },
  { value: "SOBREMESA", label: "Sobremesas" },
  { value: "BEBIDA", label: "Bebidas" },
  { value: "OUTROS", label: "Outros" },
];

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  DOCE: "Doce",
  SALGADO: "Salgado",
  BEBIDA: "Bebida",
  SOBREMESA: "Sobremesa",
  OUTROS: "Outros",
};

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Imagem enviada vem pelo proxy /api (mesma origem); o backend devolve /api/v1/receitas/imagem/{id}.
export function getRecipeImage(recipe: Pick<Receita, "categoria"> & { imagemUrl?: string | null }): string {
  if (recipe.imagemUrl) return `/api${recipe.imagemUrl.replace(/^\/api\/v1/, "")}`;
  return `/images/placeholder/${recipe.categoria.toLowerCase()}.webp`;
}

export const UNIDADE_LABEL: Record<UnidadeMedida, string> = {
  GRAMA: "g",
  QUILOGRAMA: "kg",
  MILILITRO: "ml",
  LITRO: "l",
  UNIDADE: "un.",
  XICARA: "xícara(s)",
  COLHER_SOPA: "colher(es) de sopa",
  COLHER_CHA: "colher(es) de chá",
  A_GOSTO: "a gosto",
};

export const UNIDADES = (Object.keys(UNIDADE_LABEL) as UnidadeMedida[]).map((value) => ({
  value,
  label: UNIDADE_LABEL[value],
}));

const FRACOES = [
  { value: 0.25, label: "¼" },
  { value: 1 / 3, label: "⅓" },
  { value: 0.5, label: "½" },
  { value: 2 / 3, label: "⅔" },
  { value: 0.75, label: "¾" },
];

// 1.5 -> "1 ½"; 0,25 -> "¼"; 0.6 -> "0,6"
export function formatFracao(value: number): string {
  const whole = Math.floor(value);
  const rest = value - whole;
  if (rest < 0.005) return String(whole);
  const hit = FRACOES.find((f) => Math.abs(f.value - rest) < 0.005);
  if (!hit) return value.toLocaleString("pt-BR");
  return whole ? `${whole} ${hit.label}` : hit.label;
}

// Opções do seletor de quantidade (xícara e colheres): ¼, ⅓, ½, ⅔, ¾, 1, 1 ¼, 1 ½ ...
export const QUANTIDADES_COMUNS = [
  ...FRACOES.map((f) => f.value),
  1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5,
].map((value) => ({ value, label: formatFracao(value) }));

export function formatQuantidade({ quantidade, unidadeMedida }: Ingrediente): string {
  if (unidadeMedida === "A_GOSTO") return UNIDADE_LABEL.A_GOSTO;
  return `${formatFracao(quantidade)} ${UNIDADE_LABEL[unidadeMedida]}`;
}
