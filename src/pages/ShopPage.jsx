import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import useProducts from "../hooks/useProducts";
import useDebounce from "../hooks/useDebounce";
import { useCart } from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useWishlist } from "../context/WishlistContext";
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

const PAGE_SIZE = 12;
const DEAL_MIN_DISCOUNT = 15; // "Deals" = this % off or more

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

  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(null); // null = no price limit
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
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

  // Filter options come from the data (nothing hardcoded)
  const categories = useMemo(() => [...new Set(baseProducts.map((p) => p.category))].sort(), [baseProducts]);
  const allBrands = useMemo(() => [...new Set(baseProducts.map((p) => p.brand))].sort(), [baseProducts]);
  const priceMax = useMemo(
    () => (baseProducts.length ? Math.ceil(Math.max(...baseProducts.map((p) => p.finalPrice))) : 0),
    [baseProducts]
  );
  const priceLimit = Math.min(maxPrice ?? priceMax, priceMax);

  // Search + category + price + brand + rating, then sort
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const items = baseProducts.filter(
      (p) =>
        (!q || p.name.toLowerCase().includes(q)) &&
        (!category || p.category === category) &&
        p.finalPrice <= priceLimit &&
        (brands.length === 0 || brands.includes(p.brand)) &&
        p.rating >= minRating
    );

    if (sort === "price-asc") items.sort((a, b) => a.finalPrice - b.finalPrice);
    if (sort === "price-desc") items.sort((a, b) => b.finalPrice - a.finalPrice);
    return items;
  }, [baseProducts, search, category, priceLimit, brands, minRating, sort]);

  // Go back to page 1 whenever any filter changes
  useEffect(() => {
    setPage(1);
  }, [search, category, sort, maxPrice, brands, minRating]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handlers
  const handlePage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handlePrice = (value) => setMaxPrice(value >= priceMax ? null : value);
  const toggleBrand = (brand) =>
    setBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

  const activeCount = [category !== "", maxPrice !== null, brands.length > 0, minRating > 0].filter(Boolean).length;
  const hasActiveFilters = activeCount > 0 || search.trim() !== "";
  const isWishlistEmpty = mode === "wishlist" && !loading && baseProducts.length === 0;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setMaxPrice(null);
    setBrands([]);
    setMinRating(0);
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

    if (!loading && total === 0) {
      return (
        <div className="py-16 text-center">
          <p className="font-medium">No products match your filters.</p>
          <p className="mb-4 text-sm text-slate-500">Try a different search or clear the filters.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      );
    }

    return (
      <>
        <ProductGrid products={visible} loading={loading} view={view} onAddToCart={handleAddToCart} />
        {!loading && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}-{(page - 1) * PAGE_SIZE + visible.length} of {total} products
          </p>
        )}
        {!loading && <Pagination page={page} totalPages={totalPages} onChange={handlePage} />}
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
          Filters{activeCount > 0 && ` (${activeCount})`}
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <ViewToggle value={view} onChange={setView} />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters: toggled on mobile, always visible on desktop */}
        <aside className={`${showFilters ? "block" : "hidden"} lg:block lg:w-64 lg:shrink-0`}>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
            <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
            <PriceFilter max={priceMax} value={priceLimit} onChange={handlePrice} />
            <BrandFilter brands={allBrands} selected={brands} onToggle={toggleBrand} />
            <RatingFilter value={minRating} onChange={setMinRating} />
            {hasActiveFilters && (
              <div className="py-4">
                <Button variant="outline" className="w-full" onClick={clearFilters}>
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