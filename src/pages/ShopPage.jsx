import { useState, useMemo } from "react";
import useProducts from "../hooks/useProducts";
import useDebounce from "../hooks/useDebounce";
import { useCart } from "../context/CartContext";
import SearchBar from "../components/filters/SearchBar";
import SortSelect from "../components/filters/SortSelect";
import CategoryFilter from "../components/filters/CategoryFilter";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/product/Pagination";
import ErrorMessage from "../components/ui/ErrorMessage";
import Button from "../components/ui/Button";

const PAGE_SIZE = 12;

export default function ShopPage() {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);

  const search = useDebounce(searchInput, 300);
  const { products = [], loading, error, retry } = useProducts();
  const { addToCart, openCart } = useCart();

  // Categories are built from the fetched data (nothing hardcoded)
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))].sort(), [products]);

  // Search -> category -> sort
  const filtered = useMemo(() => {
    let items = products;

    const q = search.trim().toLowerCase();
    if (q) items = items.filter((p) => p.name.toLowerCase().includes(q));
    if (category) items = items.filter((p) => p.category === category);

    if (sort === "price-asc") items = [...items].sort((a, b) => a.finalPrice - b.finalPrice);
    if (sort === "price-desc") items = [...items].sort((a, b) => b.finalPrice - a.finalPrice);

    return items;
  }, [products, search, category, sort]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Any filter change goes back to page 1
  const handleSearch = (v) => { setSearchInput(v); setPage(1); };
  const handleCategory = (v) => { setCategory(v); setPage(1); };
  const handleSort = (v) => { setSort(v); setPage(1); };
  const handlePage = (n) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const clearFilters = () => { setSearchInput(""); setCategory(""); setSort(""); setPage(1); };

  const handleAddToCart = (product) => {
    addToCart(product);
    openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Shop</h1>
      <p className="mb-6 text-slate-500">Discover our products</p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar value={searchInput} onChange={handleSearch} />
        <SortSelect value={sort} onChange={handleSort} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="lg:w-60 lg:shrink-0">
          <CategoryFilter categories={categories} selected={category} onSelect={handleCategory} />
        </aside>

        <section className="min-w-0 flex-1">
          {error ? (
            <ErrorMessage message={error} onRetry={retry} />
          ) : !loading && total === 0 ? (
            <div className="py-16 text-center">
              <p className="font-medium">No products match your search.</p>
              <p className="mb-4 text-sm text-slate-500">Try a different word or clear the filters.</p>
              <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          ) : (
            <>
              <ProductGrid products={visible} loading={loading} onAddToCart={handleAddToCart} />
              {!loading && (
                <p className="mt-6 text-center text-sm text-slate-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}-{(page - 1) * PAGE_SIZE + visible.length} of {total} products
                </p>
              )}
              {!loading && <Pagination page={page} totalPages={totalPages} onChange={handlePage} />}
            </>
          )}
        </section>
      </div>
    </div>
  );
}