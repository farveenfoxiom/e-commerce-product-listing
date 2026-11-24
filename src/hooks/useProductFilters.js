import { useState, useMemo, useEffect } from "react";
import { PAGE_SIZE } from "../constants";

// Filtering, sorting and pagination for a list of products
export default function useProductFilters(baseProducts, search) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(null); // null = no price limit
  const [brands, setBrands] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);

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

  const goToPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setPrice = (value) => setMaxPrice(value >= priceMax ? null : value);

  const toggleBrand = (brand) =>
    setBrands((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]));

  const resetFilters = () => {
    setCategory("");
    setSort("");
    setMaxPrice(null);
    setBrands([]);
    setMinRating(0);
  };

  const activeCount = [category !== "", maxPrice !== null, brands.length > 0, minRating > 0].filter(Boolean).length;

  return {
    // current values
    category, sort, brands, minRating, priceLimit,
    // setters
    setCategory, setSort, setMinRating, setPrice, toggleBrand, resetFilters,
    // options built from the data
    categories, allBrands, priceMax,
    // results
    visible, total, page, totalPages, goToPage,
    activeCount,
  };
}