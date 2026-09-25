"use client";

import { useId } from "react";
import styles from "./SearchBar.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const id = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        Buscar por nome ou ingrediente
      </label>
      <div className={styles.wrap}>
        <svg className={styles.icon} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          className={styles.input}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Ex.: cenoura, pudim, sem forno"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>
    </div>
  );
}
