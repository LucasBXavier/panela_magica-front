"use client";

import Skeleton from "@mui/material/Skeleton";
import styles from "./AuthFormSkeleton.module.css";

// fields: quantidade de inputs (login = 2, registrar = 3)
export default function AuthFormSkeleton({ fields = 2 }: { fields?: number }) {
  return (
    <main className={styles.main} aria-busy="true" aria-label="Carregando formulário">
      <div className={styles.card}>
        <Skeleton variant="circular" animation="wave" width={72} height={72} />
        <Skeleton animation="wave" width="70%" height={36} />
        <Skeleton animation="wave" width="55%" />
        <div className={styles.form}>
          {Array.from({ length: fields }, (_, i) => (
            <div key={i}>
              <Skeleton animation="wave" width="20%" />
              <Skeleton variant="rounded" animation="wave" height={52} sx={{ borderRadius: "999px", mt: 0.5, mb: 1.5 }} />
            </div>
          ))}
          <Skeleton variant="rounded" animation="wave" height={48} sx={{ borderRadius: "999px" }} />
        </div>
      </div>
    </main>
  );
}
