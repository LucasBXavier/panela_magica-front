"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useLogin } from "../hooks/useLogin";
import styles from "./LoginForm.module.css";

export default function LoginForm({ next }: { next?: string }) {
  const { login, pending } = useLogin(next);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login({ email: String(data.get("email")), senha: String(data.get("password")) });
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
          <rect x="14" y="30" width="44" height="26" rx="10" fill="var(--accent-soft)" />
          <path d="M10 30h52" stroke="var(--accent-ink)" strokeWidth="3" strokeLinecap="round" />
          <path
            d="M28 22c0-4 4-4 4-8M40 22c0-4 4-4 4-8"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <h1 className={styles.title}>
          Bem-vindo ao <Link href="/">Panela Mágica</Link>
        </h1>
        <p className={styles.text}>Faça login para acessar suas receitas favoritas.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" required />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="current-password"
            maxLength={72}
            required
          />


          <button type="submit" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className={styles.register}>
          Não tem uma conta? <Link href="/registrar">Registre-se</Link>
        </p>
      </div>
    </main>
  );
}
