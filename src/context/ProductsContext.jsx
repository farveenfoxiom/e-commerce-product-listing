import { createContext, useContext } from "react";
import useProducts from "../hooks/useProducts";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const value = useProducts(); // fetched once, shared by every page
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProductsData() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsData must be used inside <ProductsProvider>");
  return ctx;
}