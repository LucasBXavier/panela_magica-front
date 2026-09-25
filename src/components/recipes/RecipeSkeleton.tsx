import styles from "./RecipeSkeleton.module.css";

export default function RecipeSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Carregando receitas">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.card}>
          <div className={`${styles.media} ${styles.shimmer}`} />
          <div className={styles.body}>
            <div className={`${styles.line} ${styles.short} ${styles.shimmer}`} />
            <div className={`${styles.line} ${styles.shimmer}`} />
            <div className={`${styles.line} ${styles.long} ${styles.shimmer}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
