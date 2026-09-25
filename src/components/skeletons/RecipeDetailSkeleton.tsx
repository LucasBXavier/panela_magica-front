"use client";

import Skeleton from "@mui/material/Skeleton";
import styles from "./RecipeDetailSkeleton.module.css";

export default function RecipeDetailSkeleton() {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Carregando receita">
      <Skeleton
        variant="rounded"
        animation="wave"
        sx={{ width: "100%", height: "auto", aspectRatio: { xs: "4 / 3", md: "4 / 5" }, borderRadius: "1.75rem" }}
      />
      <div className={styles.content}>
        <Skeleton animation="wave" width="25%" />
        <Skeleton variant="rounded" animation="wave" width="85%" height={56} />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" width="70%" />
        <Skeleton variant="rounded" animation="wave" height={224} sx={{ mt: 2, borderRadius: "1.75rem" }} />
      </div>
    </main>
  );
}
