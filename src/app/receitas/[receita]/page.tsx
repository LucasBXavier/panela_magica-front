import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIA_LABEL,
  formatQuantidade,
  getRecipeById,
  getRecipes,
} from "@/lib/recipes";
import styles from "./page.module.css";

export async function generateStaticParams() {
  const recipes = await getRecipes();
  return recipes.map((recipe) => ({ receita: recipe.id }));
}

export async function generateMetadata(
  props: PageProps<"/receitas/[receita]">,
): Promise<Metadata> {
  const { receita } = await props.params;
  const recipe = await getRecipeById(receita);
  if (!recipe) return { title: "Receita não encontrada" };
  return { title: `${recipe.nome} — Panela Mágica`, description: recipe.descricao };
}

export default async function RecipePage(props: PageProps<"/receitas/[receita]">) {
  const { receita } = await props.params;
  const recipe = await getRecipeById(receita);
  if (!recipe) notFound();

  const steps = recipe.modoPreparo.split("\n").filter(Boolean);
  const publishedAt = recipe.dataCriacao.split(" ")[0];

  return (
    <main className={styles.main}>
      <div className={styles.media}>
        <Image
          src={recipe.imagem}
          alt={`Foto de ${recipe.nome}`}
          fill
          sizes="(max-width: 899px) 100vw, 45vw"
          preload
        />
      </div>

      <article className={styles.content}>
        <Link href="/#busca" className={styles.back}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Voltar às receitas
        </Link>

        <header className={styles.header}>
          <span className={styles.badge}>{CATEGORIA_LABEL[recipe.categoria]}</span>
          <h1 className={styles.title}>{recipe.nome}</h1>
          <p className={styles.description}>{recipe.descricao}</p>
        </header>

        <dl className={styles.meta}>
          <div>
            <dt>Preparo</dt>
            <dd>{recipe.tempoPreparo}</dd>
          </div>
          <div>
            <dt>Rende</dt>
            <dd>{recipe.rendimento}</dd>
          </div>
          <div>
            <dt>Publicada em</dt>
            <dd>{publishedAt}</dd>
          </div>
        </dl>

        <section className={styles.section} aria-labelledby="ingredientes">
          <h2 id="ingredientes" className={styles.heading}>
            Ingredientes
          </h2>
          <ul className={styles.ingredients}>
            {recipe.ingredientes.map((ingrediente) => (
              <li key={ingrediente.nomeIngrediente}>
                <span>{ingrediente.nomeIngrediente}</span>
                <span className={styles.quantity}>{formatQuantidade(ingrediente)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="preparo">
          <h2 id="preparo" className={styles.heading}>
            Modo de preparo
          </h2>
          <ol className={styles.steps}>
            {steps.map((step, index) => (
              <li key={index} style={{ "--index": index } as React.CSSProperties}>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </article>
    </main>
  );
}
