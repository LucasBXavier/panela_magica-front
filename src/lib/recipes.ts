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

// Espelha ReceitaResponseDTO da API (API_DOCUMENTATION.md)
export interface Receita {
  id: string;
  nome: string;
  descricao: string;
  ingredientes: Ingrediente[];
  modoPreparo: string;
  tempoPreparo: string;
  rendimento: string;
  categoria: Categoria;
  unidadeMedida: UnidadeMedida;
  dataCriacao: string;
  imagem: string;
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

const img = (name: string) => `/receitas/${name}.jpg`;

const MOCK: Receita[] = [
  {
    id: "9a7c2d10-41c3-4d1e-8a52-0b7d1f3e6a01",
    nome: "Bolo de cenoura com calda de chocolate",
    descricao: "Massa úmida batida no liquidificador e cobertura que trinca de leve ao morder.",
    ingredientes: [
      { nomeIngrediente: "Cenoura", quantidade: 3, unidadeMedida: "UNIDADE" },
      { nomeIngrediente: "Farinha de trigo", quantidade: 2, unidadeMedida: "XICARA" },
      { nomeIngrediente: "Açúcar", quantidade: 300, unidadeMedida: "GRAMA" },
    ],
    modoPreparo: "Pré-aqueça o forno a 180 °C e unte uma forma com furo central.\nBata no liquidificador a cenoura picada, os ovos e o óleo até obter um creme liso.\nTransfira para uma tigela, misture o açúcar e a farinha e, por último, o fermento.\nAsse por 40 minutos, até que um palito saia limpo.\nCubra com a calda de chocolate ainda morna.",
    tempoPreparo: "1h 10min",
    rendimento: "12 fatias",
    categoria: "DOCE",
    unidadeMedida: "GRAMA",
    dataCriacao: "12/09/2026 09:41:00",
    imagem: img("bolo-cenoura"),
  },
  {
    id: "2c41e7b8-95f0-4a6d-b1c3-7e8d92a04b02",
    nome: "Feijoada leve de panela de pressão",
    descricao: "Feijão preto encorpado com carnes defumadas, pronta em menos de uma hora.",
    ingredientes: [
      { nomeIngrediente: "Feijão preto", quantidade: 500, unidadeMedida: "GRAMA" },
      { nomeIngrediente: "Linguiça calabresa", quantidade: 300, unidadeMedida: "GRAMA" },
      { nomeIngrediente: "Louro", quantidade: 2, unidadeMedida: "UNIDADE" },
    ],
    modoPreparo: "Deixe o feijão de molho por 8 horas e escorra.\nSele a linguiça e as carnes na panela de pressão com um fio de óleo.\nJunte o feijão, o louro e água até cobrir por dois dedos.\nCozinhe por 35 minutos após pegar pressão.\nAbra a panela, acerte o sal e deixe apurar em fogo baixo por 10 minutos.",
    tempoPreparo: "55 minutos",
    rendimento: "8 porções",
    categoria: "SALGADO",
    unidadeMedida: "GRAMA",
    dataCriacao: "09/09/2026 18:12:00",
    imagem: img("feijoada"),
  },
  {
    id: "5e0d3a96-2b71-4c48-9f15-a1c6d7e30b03",
    nome: "Vitamina cremosa de manga",
    descricao: "Manga madura batida com iogurte e gelo, espessa o bastante para tomar de colher.",
    ingredientes: [
      { nomeIngrediente: "Manga", quantidade: 2, unidadeMedida: "UNIDADE" },
      { nomeIngrediente: "Iogurte natural", quantidade: 170, unidadeMedida: "GRAMA" },
      { nomeIngrediente: "Mel", quantidade: 1, unidadeMedida: "COLHER_SOPA" },
    ],
    modoPreparo: "Descasque as mangas e corte em cubos.\nBata a manga com o iogurte, o mel e um punhado de gelo por 1 minuto.\nSirva na hora, ainda gelada.",
    tempoPreparo: "8 minutos",
    rendimento: "2 copos",
    categoria: "BEBIDA",
    unidadeMedida: "MILILITRO",
    dataCriacao: "03/09/2026 15:20:00",
    imagem: img("vitamina-manga"),
  },
  {
    id: "7b18f4c2-d3a9-4e60-8b27-c5f01a9e4d04",
    nome: "Pudim de leite condensado",
    descricao: "Textura de creme, sem furinhos, com calda de caramelo bem escura.",
    ingredientes: [
      { nomeIngrediente: "Leite condensado", quantidade: 1, unidadeMedida: "UNIDADE" },
      { nomeIngrediente: "Leite integral", quantidade: 400, unidadeMedida: "MILILITRO" },
      { nomeIngrediente: "Ovos", quantidade: 3, unidadeMedida: "UNIDADE" },
    ],
    modoPreparo: "Faça o caramelo derretendo o açúcar na forma até dourar bem.\nBata o leite condensado, o leite e os ovos sem incorporar ar.\nCoe a mistura sobre o caramelo.\nCubra com papel-alumínio e asse em banho-maria a 170 °C por 50 minutos.\nEspere esfriar e leve à geladeira por 4 horas antes de desenformar.",
    tempoPreparo: "1h 20min",
    rendimento: "10 fatias",
    categoria: "SOBREMESA",
    unidadeMedida: "MILILITRO",
    dataCriacao: "28/08/2026 20:05:00",
    imagem: img("pudim"),
  },
  {
    id: "c3d95a1e-6f42-47b8-a0d3-92e7b8c15f05",
    nome: "Pão de queijo de liquidificador",
    descricao: "Casquinha crocante por fora, miolo elástico por dentro, sem sova.",
    ingredientes: [
      { nomeIngrediente: "Polvilho doce", quantidade: 2, unidadeMedida: "XICARA" },
      { nomeIngrediente: "Queijo minas curado", quantidade: 200, unidadeMedida: "GRAMA" },
      { nomeIngrediente: "Leite", quantidade: 1, unidadeMedida: "XICARA" },
    ],
    modoPreparo: "Pré-aqueça o forno a 200 °C.\nBata no liquidificador o leite, o óleo, os ovos e o sal.\nJunte o polvilho e o queijo e bata até a massa ficar lisa.\nDistribua a massa em forminhas de empada ou de muffin.\nAsse por 25 minutos, até dourar.",
    tempoPreparo: "35 minutos",
    rendimento: "24 unidades",
    categoria: "SALGADO",
    unidadeMedida: "GRAMA",
    dataCriacao: "21/08/2026 07:33:00",
    imagem: img("pao-queijo"),
  },
  {
    id: "e4a7c8d0-1b35-49f2-83c6-0d5e1a7b9f06",
    nome: "Brigadeiro de colher com sal marinho",
    descricao: "Ponto cremoso de panela, finalizado com flocos de sal.",
    ingredientes: [
      { nomeIngrediente: "Leite condensado", quantidade: 1, unidadeMedida: "UNIDADE" },
      { nomeIngrediente: "Cacau em pó", quantidade: 3, unidadeMedida: "COLHER_SOPA" },
      { nomeIngrediente: "Manteiga", quantidade: 1, unidadeMedida: "COLHER_SOPA" },
    ],
    modoPreparo: "Em uma panela, misture o leite condensado, o cacau e a manteiga.\nCozinhe em fogo baixo, mexendo sempre, até o fundo da panela aparecer por 2 segundos.\nDistribua em potinhos e finalize com flocos de sal marinho.",
    tempoPreparo: "15 minutos",
    rendimento: "6 porções",
    categoria: "DOCE",
    unidadeMedida: "GRAMA",
    dataCriacao: "15/08/2026 21:48:00",
    imagem: img("brigadeiro"),
  },
  {
    id: "f6b2d9e3-8c04-4a71-b5d8-3e9a0c2f7d07",
    nome: "Sopa cremosa de tomate assado",
    descricao: "Tomates caramelizados no forno com alho e manjericão, batidos até ficar aveludada.",
    ingredientes: [
      { nomeIngrediente: "Tomate italiano", quantidade: 1, unidadeMedida: "QUILOGRAMA" },
      { nomeIngrediente: "Alho", quantidade: 6, unidadeMedida: "UNIDADE" },
      { nomeIngrediente: "Creme de leite", quantidade: 4, unidadeMedida: "COLHER_SOPA" },
    ],
    modoPreparo: "Pré-aqueça o forno a 180 °C.\nDistribua os tomates cortados ao meio e o alho em uma assadeira, regue com azeite e asse por 45 minutos.\nBata os tomates assados com o caldo quente.\nVolte à panela, acerte o sal e finalize com o creme de leite.",
    tempoPreparo: "1 hora",
    rendimento: "4 porções",
    categoria: "SALGADO",
    unidadeMedida: "MILILITRO",
    dataCriacao: "07/08/2026 12:10:00",
    imagem: img("sopa-tomate"),
  },
  {
    id: "0a8e5c7f-b419-4d36-92a0-6f1d3b8e2c08",
    nome: "Alfajor de chocolate com doce de leite",
    descricao: "Biscoito amanteigado de cacau recheado com doce de leite firme.",
    ingredientes: [
      { nomeIngrediente: "Farinha de trigo", quantidade: 250, unidadeMedida: "GRAMA" },
      { nomeIngrediente: "Cacau em pó", quantidade: 4, unidadeMedida: "COLHER_SOPA" },
      { nomeIngrediente: "Doce de leite", quantidade: 300, unidadeMedida: "GRAMA" },
    ],
    modoPreparo: "Misture a farinha, o cacau, a manteiga e a gema até formar uma massa homogênea.\nAbra a massa com 5 mm de espessura e corte discos de 6 cm.\nAsse a 180 °C por 12 minutos e deixe esfriar por completo.\nRecheie os discos com doce de leite, montando os sanduíches.",
    tempoPreparo: "50 minutos",
    rendimento: "16 unidades",
    categoria: "DOCE",
    unidadeMedida: "GRAMA",
    dataCriacao: "30/07/2026 08:02:00",
    imagem: img("alfajor"),
  },
];

// Ponto de troca: GET /api/v1/receitas com "Authorization: Bearer <token>"
// quando a API passar a retornar a lista de ReceitaResponseDTO.
export async function getRecipes(): Promise<Receita[]> {
  return MOCK;
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

export function formatQuantidade({ quantidade, unidadeMedida }: Ingrediente): string {
  if (unidadeMedida === "A_GOSTO") return UNIDADE_LABEL.A_GOSTO;
  return `${quantidade.toLocaleString("pt-BR")} ${UNIDADE_LABEL[unidadeMedida]}`;
}

// Ponto de troca: GET /api/v1/receitas/{id} com "Authorization: Bearer <token>"
export async function getRecipeById(id: string): Promise<Receita | null> {
  return MOCK.find((recipe) => recipe.id === id) ?? null;
}
