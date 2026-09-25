"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { CATEGORIAS, UNIDADES, QUANTIDADES_COMUNS, formatFracao, getRecipeImage, type Categoria, type Receita, type UnidadeMedida } from "@/lib/recipes";
import Combobox from "@/components/ui/Combobox";
import ImageField, { type ImageFieldHandle } from "./ImageField";
import { useSaveRecipe } from "../hooks/useSaveRecipe";
import type { CreateRecipeInput, UpdateRecipeInput } from "../services/recipes.service";
import styles from "./RecipeForm.module.css";

// Unidades em que faz sentido usar fração (meia xícara, 1/4 de colher...).
const UNIDADES_COM_FRACAO: UnidadeMedida[] = ["XICARA", "COLHER_SOPA", "COLHER_CHA"];

const QUANTIDADE_OPTIONS = QUANTIDADES_COMUNS.map((q) => ({ value: String(q.value), label: q.label }));

// Valor já salvo que não está na lista (ex.: 0,6) continua selecionável.
function quantidadeOptions(current: string) {
  if (!current || QUANTIDADE_OPTIONS.some((o) => o.value === current)) return QUANTIDADE_OPTIONS;
  return [{ value: current, label: formatFracao(Number(current)) }, ...QUANTIDADE_OPTIONS];
}

interface IngredientRow {
  key: number;
  nome: string;
  quantidade: string;
  unidade: UnidadeMedida;
}

interface Props {
  recipe?: Receita;
}

function changedFields(recipe: Receita, input: CreateRecipeInput): UpdateRecipeInput {
  const changed: UpdateRecipeInput = {};
  for (const key of Object.keys(input) as (keyof CreateRecipeInput)[]) {
    if (JSON.stringify(input[key]) !== JSON.stringify(recipe[key])) Object.assign(changed, { [key]: input[key] });
  }
  return changed;
}

export default function RecipeForm({ recipe }: Props) {
  const { save, pending, error } = useSaveRecipe(recipe?.id);
  const imageField = useRef<ImageFieldHandle>(null);
  const [categoria, setCategoria] = useState<Categoria>(recipe?.categoria ?? "DOCE");

  const [nextKey, setNextKey] = useState(() => (recipe?.ingredientes.length ?? 1));
  const [rows, setRows] = useState<IngredientRow[]>(() =>
    recipe?.ingredientes.length
      ? recipe.ingredientes.map((ing, key) => ({
          key,
          nome: ing.nomeIngrediente,
          quantidade: String(ing.quantidade),
          unidade: ing.unidadeMedida,
        }))
      : [{ key: 0, nome: "", quantidade: "", unidade: "GRAMA" }],
  );

  function updateRow(key: number, patch: Partial<IngredientRow>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  function addRow() {
    setRows((current) => [...current, { key: nextKey, nome: "", quantidade: "", unidade: "GRAMA" }]);
    setNextKey((k) => k + 1);
  }

  function removeRow(key: number) {
    setRows((current) => (current.length > 1 ? current.filter((row) => row.key !== key) : current));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const image = await imageField.current?.getFile();
    const input: CreateRecipeInput = {
      nome: String(data.get("nome")).trim(),
      descricao: String(data.get("descricao")).trim(),
      categoria,
      tempoPreparo: String(data.get("tempoPreparo")).trim(),
      rendimento: String(data.get("rendimento")).trim(),
      modoPreparo: String(data.get("modoPreparo")).trim(),
      ingredientes: rows.map((row) => ({
        nomeIngrediente: row.nome.trim(),
        quantidade: Number(row.quantidade),
        unidadeMedida: row.unidade,
      })),
    };
    // A atualização é parcial: na edição só vai o que mudou.
    save(recipe ? changedFields(recipe, input) : input, image, imageField.current?.isRemoved());
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <ImageField ref={imageField} currentImage={recipe?.imagemUrl ? getRecipeImage(recipe) : null} />

      <div className={styles.field}>
        <label htmlFor="nome">Nome</label>
        <input id="nome" name="nome" defaultValue={recipe?.nome} required />
      </div>

      <div className={styles.field}>
        <label htmlFor="descricao">Descrição</label>
        <textarea id="descricao" name="descricao" rows={3} defaultValue={recipe?.descricao} required />
      </div>

      <div className={styles.grid}>
        <div className={styles.field}>
          <label htmlFor="categoria">Categoria</label>
          <Combobox
            id="categoria"
            options={CATEGORIAS}
            value={categoria}
            onChange={(value) => setCategoria(value as Categoria)}
            required
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="tempoPreparo">Tempo de preparo</label>
          <input id="tempoPreparo" name="tempoPreparo" placeholder="45 min" defaultValue={recipe?.tempoPreparo} required />
        </div>
        <div className={styles.field}>
          <label htmlFor="rendimento">Rendimento</label>
          <input id="rendimento" name="rendimento" placeholder="8 porções" defaultValue={recipe?.rendimento} required />
        </div>
      </div>

      <fieldset className={styles.ingredients}>
        <legend>Ingredientes</legend>
        <ul>
          {rows.map((row, index) => (
            <li key={row.key} className={styles.row}>
              <input
                aria-label={`Ingrediente ${index + 1}`}
                placeholder="Ingrediente"
                value={row.nome}
                onChange={(e) => updateRow(row.key, { nome: e.target.value })}
                required
              />
              {UNIDADES_COM_FRACAO.includes(row.unidade) ? (
                <Combobox
                  ariaLabel={`Quantidade do ingrediente ${index + 1}`}
                  placeholder="Qtd."
                  options={quantidadeOptions(row.quantidade)}
                  value={row.quantidade}
                  onChange={(quantidade) => updateRow(row.key, { quantidade })}
                  required
                />
              ) : (
                <input
                  aria-label={`Quantidade do ingrediente ${index + 1}`}
                  placeholder="Qtd."
                  type="number"
                  inputMode="decimal"
                  min="0.01"
                  step="any"
                  value={row.quantidade}
                  onChange={(e) => updateRow(row.key, { quantidade: e.target.value })}
                  required
                />
              )}
              <Combobox
                ariaLabel={`Unidade do ingrediente ${index + 1}`}
                options={UNIDADES}
                value={row.unidade}
                onChange={(unidade) => updateRow(row.key, { unidade: unidade as UnidadeMedida })}
              />
              <button
                type="button"
                className={styles.remove}
                onClick={() => removeRow(row.key)}
                disabled={rows.length === 1}
                aria-label={`Remover ingrediente ${index + 1}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button type="button" className={styles.add} onClick={addRow}>
          + Adicionar ingrediente
        </button>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor="modoPreparo">Modo de preparo</label>
        <textarea
          id="modoPreparo"
          name="modoPreparo"
          rows={8}
          placeholder={"Um passo por linha.\nMisture os ingredientes secos.\nLeve ao forno por 40 minutos."}
          defaultValue={recipe?.modoPreparo}
          required
        />
        <small>Escreva um passo por linha.</small>
      </div>

      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.actions}>
        <Link href="/dashboard" className={styles.cancel}>
          Cancelar
        </Link>
        <button type="submit" className={styles.submit} disabled={pending}>
          {pending ? "Salvando…" : recipe ? "Salvar alterações" : "Publicar receita"}
        </button>
      </div>
    </form>
  );
}
