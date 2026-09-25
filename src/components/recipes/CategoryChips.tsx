"use client";

import { CATEGORIAS, type Categoria } from "@/lib/recipes";
import styles from "./CategoryChips.module.css";

interface Props {
  value: Categoria | null;
  onChange: (value: Categoria | null) => void;
}

export default function CategoryChips({ value, onChange }: Props) {
  const options: { value: Categoria | null; label: string }[] = [
    { value: null, label: "Todas" },
    ...CATEGORIAS,
  ];

  return (
    <div className={styles.group} role="group" aria-label="Filtrar por categoria">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          className={styles.chip}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
