import RecipeSkeleton from "@/components/recipes/RecipeSkeleton";

export default function Loading() {
  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem var(--pad-x)" }}>
      <RecipeSkeleton />
    </main>
  );
}
