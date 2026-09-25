import Link from "next/link";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Panela Mágica, início">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M6 14h20v6a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8v-6Z" fill="currentColor" />
            <path
              d="M3 14h26M12 8c0-2 2-2 2-4M18 8c0-2 2-2 2-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Panela Mágica</span>
        </Link>
        <nav aria-label="Principal" className={styles.nav}>
          <Link href="/" aria-current="page" className={styles.active}>
            Receitas
          </Link>
        </nav>
      </div>
    </header>
  );
}
