import RecipeListSkeleton from "@/components/skeletons/RecipeListSkeleton";

export default function Loading() {
  return (
    <main style={{ maxWidth: 1400, margin: "0 auto", padding: "2rem var(--pad-x)" }}>
      <RecipeListSkeleton />
    </main>
  );
}
