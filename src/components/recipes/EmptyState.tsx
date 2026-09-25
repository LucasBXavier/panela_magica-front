import styles from "./EmptyState.module.css";

interface Props {
  query: string;
  onClear: () => void;
}

export default function EmptyState({ query, onClear }: Props) {
  return (
    <div className={styles.wrap}>
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <rect x="14" y="30" width="44" height="26" rx="10" fill="var(--accent-soft)" />
        <path d="M10 30h52" stroke="var(--accent-ink)" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M28 22c0-4 4-4 4-8M40 22c0-4 4-4 4-8"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          className={styles.steam}
        />
      </svg>
      <h3 className={styles.title}>
        {query ? `Nada por aqui para "${query}"` : "Nenhuma receita nesta categoria"}
      </h3>
      <p className={styles.text}>
        Tente outro ingrediente, confira a grafia ou volte para todas as categorias.
      </p>
      <button type="button" className={styles.button} onClick={onClear}>
        Limpar busca
      </button>
    </div>
  );
}
