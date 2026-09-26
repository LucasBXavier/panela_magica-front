export interface Usuario {
  id: string;
  nome: string;
  email: string;
  dataCriacao: string;
}

export interface LoginInput {
  email: string;
  senha: string;
}

export interface RegisterInput {
  nome: string;
  email: string;
  senha: string;
}

// Resposta do backend; só o servidor (route handler) a enxerga.
export interface LoginResponse {
  token: string;
  type: "Bearer";
  expiresIn: number;
  refreshToken: string;
  refreshExpiresIn: number;
  usuario: Usuario;
}
