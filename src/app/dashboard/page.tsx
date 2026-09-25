import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardRecipeList from "@/features/recipes/components/DashboardRecipeList";
import { getSession } from "@/lib/server/session";
import { getMyRecipes } from "@/lib/server/recipes";
import styles from "./dashboard.module.css";

export const metadata: Metadata = { title: "Meu dashboard — Panela Mágica" };

export default async function Dashboard() {
  const usuario = await getSession();
  if (!usuario) redirect("/login?next=/dashboard");

  const recipes = await getMyRecipes();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Minhas receitas</h1>
          <p className={styles.subtitle}>
            {recipes.length === 0
              ? `Olá, ${usuario.nome}. Comece cadastrando sua primeira receita.`
              : `${recipes.length} ${recipes.length === 1 ? "receita cadastrada" : "receitas cadastradas"} por você.`}
          </p>
        </div>
        <Link href="/dashboard/nova" className={styles.button}>
          + Nova receita
        </Link>
      </header>

      {recipes.length === 0 ? (
        <section className={styles.empty}>
          <h2>Você ainda não tem receitas</h2>
          <p>Compartilhe seus pratos favoritos e eles aparecerão aqui e na página inicial.</p>
          <Link href="/dashboard/nova" className={styles.button}>
            Cadastrar receita
          </Link>
        </section>
      ) : (
        <DashboardRecipeList recipes={recipes} />
      )}
    </main>
  );
}
