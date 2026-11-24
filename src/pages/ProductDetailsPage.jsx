import { useState, useEffect, useCallback } from "react";
import { fetchProducts } from "../api/productService";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false; // ignore outdated responses
    setLoading(true);
    setError(null);

    fetchProducts()
      .then((data) => !cancelled && setProducts(data))
      .catch((err) => !cancelled && setError(err.message || "Something went wrong"))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { products, loading, error, retry };
}