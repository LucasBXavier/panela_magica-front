import { api } from "@/lib/api";
import type { LoginInput, RegisterInput, Usuario } from "../types";

export const authService = {
  login: (input: LoginInput) => api.post<{ usuario: Usuario }>("/auth/login", input),
  register: (input: RegisterInput) => api.post<null>("/usuarios", input),
  logout: () => api.post<null>("/auth/logout"),
  me: () => api.get<Usuario>("/auth/me"),
};
