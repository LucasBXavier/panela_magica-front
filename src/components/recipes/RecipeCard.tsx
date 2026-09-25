import Image from "next/image";
import Link from "next/link";
import { CATEGORIA_LABEL, getRecipeImage, type Receita } from "@/lib/recipes";
import styles from "./RecipeCard.module.css";

interface Props {
  recipe: Receita;
  featured?: boolean;
}

export default function RecipeCard({ recipe, featured = false }: Props) {
  const ingredientes = recipe.ingredientes.map((i) => i.nomeIngrediente);

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
      <div className={styles.media}>
        <Image
          src={getRecipeImage(recipe)}
          alt={`Foto de ${recipe.nome}`}
          fill
          unoptimized={!!recipe.imagemUrl}
          sizes="(max-width: 767px) 100vw, (max-width: 1099px) 50vw, 33vw"
        />
      </div>

      <div className={styles.body}>
        <span className={styles.badge}>{CATEGORIA_LABEL[recipe.categoria]}</span>
        <h3 className={styles.title}>
          <Link href={`/receitas/${recipe.id}`} className={styles.link}>
            {recipe.nome}
          </Link>
        </h3>
        <p className={styles.description}>{recipe.descricao}</p>

        <p className={styles.ingredients}>{ingredientes.join(" · ")}</p>

        <dl className={styles.meta}>
          <div>
            <dt>Tempo de Preparo</dt>
            <dd>{recipe.tempoPreparo}</dd>
          </div>
          <div>
            <dt>Rende</dt>
            <dd>{recipe.rendimento}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
