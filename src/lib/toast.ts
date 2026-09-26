import { toast } from "sonner";
import { ApiError } from "./api";

// Padrão único de erro do front: toda falha vira um toast com título (o que houve)
// e descrição (o motivo, vindo da API quando útil).
const TITLES: Record<number, string> = {
  400: "Dados inválidos",
  401: "Sessão expirada",
  403: "Acesso negado",
  404: "Não encontrado",
  409: "Conflito nos dados",
  413: "Arquivo muito grande",
  415: "Formato não suportado",
  429: "Muitas tentativas",
};

const NETWORK_MESSAGE = "Não foi possível falar com o servidor. Verifique sua conexão e tente novamente.";
const SERVER_MESSAGE = "Algo deu errado do nosso lado. Tente novamente em instantes.";

function describe(err: unknown, fallback: string): { title: string; message: string } {
  if (!(err instanceof ApiError)) {
    return { title: "Sem conexão", message: err instanceof TypeError ? NETWORK_MESSAGE : fallback };
  }
  if (err.status >= 500) return { title: "Erro no servidor", message: SERVER_MESSAGE };

  let message = err.message || fallback;
  if (err.status === 429 && err.retryAfter) message += ` Tente novamente em ${err.retryAfter}s.`;
  return { title: TITLES[err.status] ?? "Não foi possível concluir", message };
}

// `title` sobrescreve o título por status (ex.: "Não foi possível entrar" no login).
export function toastError(err: unknown, fallback: string, title?: string) {
  const info = describe(err, fallback);
  const heading = title ?? info.title;
  // id por conteúdo: o mesmo erro repetido não empilha toasts.
  toast.error(heading, { id: `${heading}:${info.message}`, description: info.message });
}

// Erro de validação feito no próprio browser (ex.: arquivo inválido), sem chamada à API.
export function toastInvalid(message: string, title = "Dados inválidos") {
  toast.error(title, { id: `${title}:${message}`, description: message });
}

// Operação concluída. A descrição é opcional.
export function toastSuccess(title: string, message?: string) {
  toast.success(title, { id: `success:${title}:${message ?? ""}`, description: message });
}

// Parcial: parte da operação deu certo.
export function toastWarning(title: string, message: string) {
  toast.warning(title, { id: `${title}:${message}`, description: message });
}
