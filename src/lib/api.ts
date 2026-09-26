// Cliente HTTP único do front. Toda chamada vai para /api/** (proxy do Next),
// que repassa ao backend e injeta o token da sessão (cookie httpOnly).

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Envelope<T> = { status: number; message: string; data: T };

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text; // a API às vezes responde texto puro
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (typeof body === "string" && body) return body;
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
    return body.message;
  }
  return fallback;
}

function isEnvelope(body: unknown): body is Envelope<unknown> {
  return !!body && typeof body === "object" && "status" in body && "data" in body;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    // FormData: o browser define o Content-Type com o boundary do multipart.
    headers: body === undefined || isForm ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  });

  const parsed = await parseBody(res);
  if (!res.ok) {
    const retryAfter = Number(res.headers.get("retry-after"));
    throw new ApiError(
      res.status,
      errorMessage(parsed, "Erro inesperado. Tente novamente."),
      retryAfter > 0 ? retryAfter : undefined,
    );
  }
  return (isEnvelope(parsed) ? parsed.data : parsed) as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};
