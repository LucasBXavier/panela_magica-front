"use client";

import Skeleton from "@mui/material/Skeleton";
import styles from "./RecipeListSkeleton.module.css";

export default function RecipeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className={styles.grid} aria-busy="true" aria-label="Carregando receitas">
      {Array.from({ length: count }, (_, i) => (
        <li key={i} className={styles.card}>
          <Skeleton variant="rectangular" animation="wave" sx={{ width: "100%", height: "auto", aspectRatio: "4 / 3" }} />
          <div className={styles.body}>
            <Skeleton animation="wave" width="30%" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" width="75%" />
          </div>
        </li>
      ))}
    </ul>
  );
}
