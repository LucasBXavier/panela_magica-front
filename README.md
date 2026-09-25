# Panela Mágica

Site de receitas: qualquer pessoa pode buscar e ler receitas; quem cria uma conta pode publicar, editar e remover as suas, com foto.

Este repositório é o **front-end**. Os dados vêm de uma API REST separada (veja [API_DOCUMENTATION.md](API_DOCUMENTATION.md)).

## O que dá para fazer

| Quem | O quê |
| --- | --- |
| Visitante | Ver a lista de receitas, buscar por nome, ingrediente ou categoria e abrir uma receita completa |
| Usuário logado | Criar conta e entrar, publicar receitas com foto, editar e apagar as próprias receitas no **Dashboard**, ver o **Perfil** |

Na criação de receita:

- **Foto:** escolha uma imagem (JPEG, PNG ou WEBP, até 5MB), arraste para enquadrar e ajuste o zoom. Ela é recortada em 16:9 antes de enviar. Sem foto, o site usa uma imagem ilustrativa da categoria.
- **Ingredientes:** para xícara e colheres a quantidade é escolhida numa lista (¼, ⅓, ½, ⅔, ¾, 1, 1 ½…); para as outras unidades, digita-se o número.
- **Edição:** só os campos alterados são enviados à API.

## Tecnologias

- [Next.js](https://nextjs.org) 16 (App Router) e React 19, com React Compiler
- TypeScript
- CSS Modules, com [Material UI](https://mui.com) só em alguns componentes (menu lateral, skeletons)
- Sem biblioteca de estado ou de formulários: hooks do React e `fetch`

> Esta versão do Next.js tem mudanças em relação às anteriores. Antes de mexer em convenções do framework, leia o guia em `node_modules/next/dist/docs/` (veja [AGENTS.md](AGENTS.md)).

## Como rodar

Pré-requisitos: Node.js 20 ou mais novo e a API do Panela Mágica rodando (por padrão em `http://localhost:8080`).

```bash
npm install
```

Crie o arquivo `.env.local` na raiz:

```env
# URL base da API, com o prefixo /api/v1
API_URL=http://localhost:8080/api/v1
```

Se a variável não existir, o padrão acima é usado. Depois:

```bash
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm run start    # serve o build
npm run lint     # ESLint
```

## Como funciona

### Autenticação e proxy

O navegador **nunca fala direto com a API** nem vê o token:

1. O login (`POST /api/auth/login`) chama a API, e o token JWT fica num cookie `httpOnly` (`pm_token`). Os dados do usuário ficam em outro cookie (`pm_user`).
2. Toda chamada do front vai para `/api/**`. O proxy em [src/app/api/[...path]/route.ts](src/app/api/[...path]/route.ts) repassa para `${API_URL}/<caminho>` e injeta o `Authorization: Bearer` a partir do cookie. Ele repassa o corpo como binário, então o upload de imagem (multipart) funciona.
3. Se a API responder 401 com um token presente, a sessão local é apagada.
4. As rotas `/dashboard` e `/perfil` são protegidas em [src/proxy.ts](src/proxy.ts): sem cookie de sessão, o usuário vai para `/login?next=…`. A autorização de verdade continua na API.

### Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Lista de receitas com busca |
| `/receitas/[id]` | Receita completa |
| `/login`, `/registrar` | Autenticação |
| `/dashboard` | Minhas receitas |
| `/dashboard/nova` | Nova receita |
| `/dashboard/[id]/editar` | Editar receita |
| `/perfil` | Dados do usuário |
| `/api/**` | Proxy para a API e rotas de sessão |

Cada rota tem seu `loading.tsx` com um skeleton próprio.

### Estrutura

```text
src/
├── app/            Rotas (App Router); (home) é um route group para o skeleton da home
├── components/     Cabeçalho, rodapé, cards, skeletons e ui/ (Combobox próprio)
├── features/
│   ├── auth/       Formulários, hooks e serviço de login/registro
│   └── recipes/    RecipeForm, ImageField, lista do dashboard, hooks e serviço
├── lib/            api.ts (cliente HTTP), recipes.ts (tipos e formatação)
│   └── server/     Código só de servidor: sessão, fetch ao backend, leitura de receitas
└── proxy.ts        Proteção otimista das rotas privadas
```

Serviços (`*.service.ts`) concentram as chamadas à API, hooks (`use*.ts`) cuidam de estado e erros, e os componentes só renderizam.

## Design

O guia visual (cores, tipografia, espaçamento e componentes) está em [DESIGN.md](DESIGN.md). Resumo: base clara, destaque âmbar, botões em pílula e cartões bem arredondados.

## Documentação da API

Rotas, corpos de requisição e erros estão em [API_DOCUMENTATION.md](API_DOCUMENTATION.md). O Swagger da API fica em `http://localhost:8080/panela-magica/swagger-ui.html`.

## Feito por

[Lucas Boareto](https://lucasboareto.vercel.app)
