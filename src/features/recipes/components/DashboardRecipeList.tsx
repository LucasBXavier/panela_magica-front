"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CATEGORIA_LABEL, formatDate, getRecipeImage, type Receita } from "@/lib/recipes";
import { useDeleteRecipe } from "../hooks/useDeleteRecipe";
import styles from "./DashboardRecipeList.module.css";

export default function DashboardRecipeList({ recipes }: { recipes: Receita[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [target, setTarget] = useState<Receita | null>(null);
  const { remove, pending } = useDeleteRecipe();

  function askDelete(recipe: Receita) {
    setTarget(recipe);
    dialogRef.current?.showModal();
  }

  function close() {
    dialogRef.current?.close();
  }

  async function confirm() {
    if (!target) return;
    if (await remove(target.id)) close();
  }

  return (
    <>
      <ul className={styles.list}>
        {recipes.map((recipe, i) => (
          <li key={recipe.id} className={styles.item} style={{ "--index": i } as React.CSSProperties}>
            <div className={styles.media}>
              <Image src={getRecipeImage(recipe)} alt="" fill sizes="96px" unoptimized={!!recipe.imagemUrl} />
            </div>
            <div className={styles.info}>
              <span className={styles.badge}>{CATEGORIA_LABEL[recipe.categoria]}</span>
              <h3 className={styles.title}>
                <Link href={`/receitas/${recipe.id}`}>{recipe.nome}</Link>
              </h3>
              <p className={styles.meta}>
                {recipe.tempoPreparo} · Rende {recipe.rendimento} · {formatDate(recipe.dataCriacao)}
              </p>
            </div>
            <div className={styles.actions}>
              <Link href={`/dashboard/${recipe.id}/editar`} className={styles.edit}>
                Editar
              </Link>
              <button type="button" className={styles.delete} onClick={() => askDelete(recipe)}>
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="delete-title" onClose={() => setTarget(null)}>
        <h2 id="delete-title">Excluir receita?</h2>
        <p>
          <strong>{target?.nome}</strong> será removida permanentemente. Essa ação não pode ser desfeita.
        </p>
        <div className={styles.dialogActions}>
          <button type="button" className={styles.cancel} onClick={close} disabled={pending}>
            Cancelar
          </button>
          <button type="button" className={styles.confirm} onClick={confirm} disabled={pending}>
            {pending ? "Excluindo…" : "Excluir"}
          </button>
        </div>
      </dialog>
    </>
  );
}
