import Image from "next/image";
import RecipeBrowser from "@/components/recipes/RecipeBrowser";
import { getRecipes } from "@/lib/server/recipes";
import styles from "./page.module.css";

export default async function Home() {
  const recipes = await getRecipes();

  return (
    <main className={styles.main}>
      <section className={styles.hero} aria-labelledby="titulo">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            {recipes.length} receitas para começar
          </p>
          <h1 id="titulo" className={styles.title}>
            Encontre a receita certa para o seu próximo prato
          </h1>
          <p className={styles.lead}>
            Busque pelo nome, por um ingrediente que sobrou na geladeira ou filtre por doces, salgados e bebidas.
          </p>
          <a className={styles.cta} href="#busca">
            Buscar receitas
          </a>
        </div>

        <div className={styles.visual}>
          <div className={styles.photoTall}>
            <Image
              src="/receitas/bolo-cenoura.jpg"
              alt="Bolo de cenoura com cobertura de chocolate"
              fill
              sizes="(max-width: 900px) 50vw, 20vw"
              preload
            />
          </div>
          <div className={styles.photoWide}>
            <Image
              src="/receitas/feijoada.jpg"
              alt="Feijoada servida na panela"
              fill
              sizes="(max-width: 900px) 50vw, 20vw"
            />
          </div>
        </div>
      </section>

      <RecipeBrowser recipes={recipes} />
    </main>
  );
}
