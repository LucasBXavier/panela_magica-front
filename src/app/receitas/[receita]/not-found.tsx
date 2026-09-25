import Link from "next/link";
import styles from "./not-found.module.css";

export default function RecipeNotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.wrap}>
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
        <h1 className={styles.title}>Receita não encontrada</h1>
        <p className={styles.text}>
          O endereço pode estar incorreto ou a receita foi removida. Volte para a lista e procure de novo.
        </p>
        <Link href="/#busca" className={styles.button}>
          Ver todas as receitas
        </Link>
      </div>
    </main>
  );
}
