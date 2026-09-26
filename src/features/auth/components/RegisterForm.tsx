"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useRegister } from "../hooks/useRegister";
import styles from "./RegisterForm.module.css";

export default function RegisterForm() {
  const { register, pending } = useRegister();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    register({
      nome: String(data.get("name")),
      email: String(data.get("email")),
      senha: String(data.get("password")),
    });
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
          Crie sua conta no <Link href="/">Panela Mágica</Link>
        </h1>
        <p className={styles.text}>Salve suas receitas favoritas e encontre-as em qualquer lugar.</p>
        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="name">Nome</label>
          <input type="text" id="name" name="name" autoComplete="name" required />

          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" autoComplete="email" required />

          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_\-])[A-Za-z\d@$!%*?&#_\-]{8,72}"
            title="De 8 a 72 caracteres, com maiúscula, minúscula, número e um símbolo (@ $ ! % * ? & # _ -). Sem acentos."
            required
          />


          <button type="submit" disabled={pending}>
            {pending ? "Criando…" : "Criar conta"}
          </button>
        </form>
        <p className={styles.login}>
          Já tem uma conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
