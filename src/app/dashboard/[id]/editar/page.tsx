import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import RecipeForm from "@/features/recipes/components/RecipeForm";
import { getMyRecipeById } from "@/lib/server/recipes";
import { getSession } from "@/lib/server/session";
import styles from "../../dashboard.module.css";

export const metadata: Metadata = { title: "Editar receita — Panela Mágica" };

export default async function EditRecipe(props: PageProps<"/dashboard/[id]/editar">) {
  const { id } = await props.params;
  if (!(await getSession())) redirect(`/login?next=/dashboard/${encodeURIComponent(id)}/editar`);

  const recipe = await getMyRecipeById(id);
  if (!recipe) notFound();

  return (
    <main className={styles.main}>
      <Link href="/dashboard" className={styles.back}>
        ← Voltar ao dashboard
      </Link>
      <header className={styles.header}>
        <h1 className={styles.title}>Editar receita</h1>
      </header>
      <RecipeForm recipe={recipe} />
    </main>
  );
}
