import styles from "./loading.module.css";

export default function Loading() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Carregando receita">
      <div className={`${styles.media} ${styles.shimmer}`} />
      <div className={styles.content}>
        <div className={`${styles.line} ${styles.short} ${styles.shimmer}`} />
        <div className={`${styles.title} ${styles.shimmer}`} />
        <div className={`${styles.line} ${styles.shimmer}`} />
        <div className={`${styles.line} ${styles.long} ${styles.shimmer}`} />
        <div className={`${styles.block} ${styles.shimmer}`} />
      </div>
    </main>
  );
}
