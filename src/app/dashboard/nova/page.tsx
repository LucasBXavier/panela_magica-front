import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import RecipeForm from "@/features/recipes/components/RecipeForm";
import { getSession } from "@/lib/server/session";
import styles from "../dashboard.module.css";

export const metadata: Metadata = { title: "Nova receita — Panela Mágica" };

export default async function NewRecipe() {
  if (!(await getSession())) redirect("/login?next=/dashboard/nova");

  return (
    <main className={styles.main}>
      <Link href="/dashboard" className={styles.back}>
        ← Voltar ao dashboard
      </Link>
      <header className={styles.header}>
        <h1 className={styles.title}>Nova receita</h1>
      </header>
      <RecipeForm />
    </main>
  );
}
