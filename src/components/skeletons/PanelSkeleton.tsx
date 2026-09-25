"use client";

import Skeleton from "@mui/material/Skeleton";
import styles from "./PanelSkeleton.module.css";

// Esqueleto genérico das páginas logadas (dashboard, formulário, perfil).
export default function PanelSkeleton({ rows = 4, label = "Carregando" }: { rows?: number; label?: string }) {
  return (
    <main className={styles.main} aria-busy="true" aria-label={label}>
      <Skeleton animation="wave" width="40%" height={44} />
      <Skeleton animation="wave" width="60%" />
      <div className={styles.rows}>
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} variant="rounded" animation="wave" height={96} sx={{ borderRadius: "1.25rem" }} />
        ))}
      </div>
    </main>
  );
}
