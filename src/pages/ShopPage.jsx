import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import useProducts from "../hooks/useProducts";
import useDebounce from "../hooks/useDebounce";
import useProductFilters from "../hooks/useProductFilters";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useWishlist } from "../context/WishlistContext";
import { PAGE_SIZE, DEAL_MIN_DISCOUNT } from "../constants";
import SortSelect from "../components/filters/SortSelect";
import ViewToggle from "../components/filters/ViewToggle";
import CategoryFilter from "../components/filters/CategoryFilter";
import PriceFilter from "../components/filters/PriceFilter";
import BrandFilter from "../components/filters/BrandFilter";
import RatingFilter from "../components/filters/RatingFilter";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/product/Pagination";
import ErrorMessage from "../components/ui/ErrorMessage";
import Button from "../components/ui/Button";

const MODES = {
  all: { title: "Shop", subtitle: "Discover our products" },
  deals: { title: "Deals", subtitle: `Products with ${DEAL_MIN_DISCOUNT}% off or more` },
  new: { title: "New Arrivals", subtitle: "Our latest products" },
  wishlist: { title: "Your Wishlist", subtitle: "Products you saved" },
};

export default function ShopPage({ mode = "all" }) {
  const { title, subtitle } = MODES[mode];

  // Search text lives in the navbar (shared through context)
  const { search: searchInput, setSearch } = useSearch();
  const search = useDebounce(searchInput, 300);

  const [view, setView] = useState("grid"); // "grid" | "list"
  const [showFilters, setShowFilters] = useState(false); // mobile only

  const { products, loading, error, retry } = useProducts();
  const { addToCart, openCart } = useCart();
  const { ids: wishlistIds } = useWishlist();

  // The products that belong to this page, before the user's filters
  const baseProducts = useMemo(() => {
    if (mode === "deals") return products.filter((p) => p.discountPercentage >= DEAL_MIN_DISCOUNT);
    if (mode === "new") return products.filter((p) => p.isNew);
    if (mode === "wishlist") return products.filter((p) => wishlistIds.includes(p.id));
    return products;
  }, [products, mode, wishlistIds]);

  const f = useProductFilters(baseProducts, search);

  const hasActiveFilters = f.activeCount > 0 || search.trim() !== "";
  const isWishlistEmpty = mode === "wishlist" && !loading && baseProducts.length === 0;

  const clearAll = () => {
    setSearch("");
    f.resetFilters();
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    openCart();
  };

  const renderResults = () => {
    if (error) return <ErrorMessage message={error} onRetry={retry} />;

    if (isWishlistEmpty) {
      return (
        <div className="py-16 text-center">
          <p className="font-medium">Your wishlist is empty</p>
          <p className="mb-4 text-sm text-slate-500">Tap the heart on a product to save it here.</p>
          <Link to="/" className="text-sm font-medium text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      );
    }

    if (!loading && f.total === 0) {
      return (
        <div className="py-16 text-center">
          <p className="font-medium">No products match your filters.</p>
          <p className="mb-4 text-sm text-slate-500">Try a different search or clear the filters.</p>
          <Button variant="outline" onClick={clearAll}>
            Clear all filters
          </Button>
        </div>
      );
    }

    const first = (f.page - 1) * PAGE_SIZE + 1;
    const last = (f.page - 1) * PAGE_SIZE + f.visible.length;

    return (
      <>
        <ProductGrid products={f.visible} loading={loading} view={view} onAddToCart={handleAddToCart} />
        {!loading && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Showing {first}-{last} of {f.total} products
          </p>
        )}
        {!loading && <Pagination page={f.page} totalPages={f.totalPages} onChange={f.goToPage} />}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mb-6 text-slate-500">{subtitle}</p>

      <div className="mb-6 flex items-center justify-between gap-3">
        <Button variant="outline" className="lg:hidden" onClick={() => setShowFilters((s) => !s)}>
          <SlidersHorizontal size={16} />
          Filters{f.activeCount > 0 && ` (${f.activeCount})`}
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <ViewToggle value={view} onChange={setView} />
          <SortSelect value={f.sort} onChange={f.setSort} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters: toggled on mobile, always visible on desktop */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block lg:w-64 lg:shrink-0`}>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
            <CategoryFilter categories={f.categories} selected={f.category} onSelect={f.setCategory} />
            <PriceFilter max={f.priceMax} value={f.priceLimit} onChange={f.setPrice} />
            <BrandFilter brands={f.allBrands} selected={f.brands} onToggle={f.toggleBrand} />
            <RatingFilter value={f.minRating} onChange={f.setMinRating} />
            {hasActiveFilters && (
              <div className="py-4">
                <Button variant="outline" className="w-full" onClick={clearAll}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </aside>

        <section className="min-w-0 flex-1">{renderResults()}</section>
      </div>
    </div>
  );
}