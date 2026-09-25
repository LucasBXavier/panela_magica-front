"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { Categoria, Receita } from "@/lib/recipes";
import CategoryChips from "./CategoryChips";
import EmptyState from "./EmptyState";
import RecipeCard from "./RecipeCard";
import SearchBar from "./SearchBar";
import styles from "./RecipeBrowser.module.css";

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

function matches(recipe: Receita, terms: string[]) {
  const haystack = normalize(
    [recipe.nome, recipe.descricao, ...recipe.ingredientes.map((i) => i.nomeIngrediente)].join(" "),
  );
  return terms.every((term) => haystack.includes(term));
}

export default function RecipeBrowser({ recipes }: { recipes: Receita[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Categoria | null>(null);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    return recipes.filter(
      (recipe) => (!category || recipe.categoria === category) && matches(recipe, terms),
    );
  }, [recipes, deferredQuery, category]);

  const clear = () => {
    setQuery("");
    setCategory(null);
  };

  const filtering = query !== "" || category !== null;

  return (
    <section id="busca" className={styles.section} aria-labelledby="busca-titulo">
      <div className={styles.controls}>
        <h2 id="busca-titulo" className={styles.heading}>
          Encontre sua próxima receita
        </h2>
        <SearchBar value={query} onChange={setQuery} />
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      <p className={styles.count} role="status" aria-live="polite">
        {results.length === 1 ? "1 receita encontrada" : `${results.length} receitas encontradas`}
        {filtering && (
          <button type="button" className={styles.clear} onClick={clear}>
            Limpar filtros
          </button>
        )}
      </p>

      {results.length > 0 ? (
        <ul className={styles.grid}>
          {results.map((recipe, index) => (
            <li
              key={recipe.id}
              className={styles.item}
              data-featured={index === 0 && results.length > 2 ? "" : undefined}
              style={{ "--index": Math.min(index, 8) } as React.CSSProperties}
            >
              <RecipeCard recipe={recipe} featured={index === 0 && results.length > 2} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState query={query} onClear={clear} />
      )}
    </section>
  );
}
