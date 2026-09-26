import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "@/features/auth/components/LogoutButton";
import { CATEGORIAS, formatDate } from "@/lib/recipes";
import { getMyRecipes } from "@/lib/server/recipes";
import { getSession } from "@/lib/server/session";
import styles from "./perfil.module.css";

export const metadata: Metadata = { title: "Meu perfil — Panela Mágica" };

function initials(nome: string): string {
  const parts = nome.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export default async function Perfil() {
  const usuario = await getSession();
  if (!usuario) redirect("/login?next=/perfil");

  const recipes = await getMyRecipes();
  const memberSince = usuario.dataCriacao ? formatDate(usuario.dataCriacao) : undefined;

  return (
    <main className={styles.main}>
      <section className={styles.card} aria-labelledby="perfil-nome">
        <div className={styles.avatar} aria-hidden="true">
          {initials(usuario.nome)}
        </div>
        <h1 id="perfil-nome" className={styles.name}>
          {usuario.nome}
        </h1>
        <dl className={styles.info}>
          <div>
            <dt>E-mail</dt>
            <dd>{usuario.email}</dd>
          </div>
          {memberSince && (
            <div>
              <dt>Membro desde</dt>
              <dd>{memberSince}</dd>
            </div>
          )}
        </dl>
        <div className={styles.actions}>
          <Link href="/dashboard" className={styles.primary}>
            Ir para o dashboard
          </Link>
          <LogoutButton className={styles.logout} />
        </div>
      </section>

      <section className={styles.stats} aria-labelledby="stats-title">
        <h2 id="stats-title" className={styles.heading}>
          Suas receitas
        </h2>
        <p className={styles.total}>
          <strong>{recipes.length}</strong> {recipes.length === 1 ? "receita cadastrada" : "receitas cadastradas"}
        </p>
        <ul className={styles.categories}>
          {CATEGORIAS.map(({ value, label }) => (
            <li key={value}>
              <span>{label}</span>
              <strong>{recipes.filter((r) => r.categoria === value).length}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
