import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";

export default function ProductGrid({ products, loading, onAddToCart, view = "grid" }) {
  // Skeletons are always shown as a grid, even while list view is selected
  const list = view === "list" && !loading;

  return (
    <div
      className={
        list
          ? "grid grid-cols-1 gap-4"
          : "grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4"
      }
    >
      {loading
        ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
        : products.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} view={view} />
          ))}
    </div>
  );
}