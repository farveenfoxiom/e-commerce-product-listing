import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "shop-cart-v1";

function cartReducer(items, action) {
  switch (action.type) {
    case "ADD": {
      const { product, quantity } = action;
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, i.stock) } : i
        );
      }
      return [
        ...items,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.finalPrice, // price actually charged
          stock: product.stock,
          quantity: Math.min(quantity, product.stock),
        },
      ];
    }
    case "INCREASE":
      return items.map((i) =>
        i.id === action.id ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) } : i
      );
    case "DECREASE":
      return items.map((i) =>
        i.id === action.id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
      );
    case "REMOVE":
      return items.filter((i) => i.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return items;
  }
}

// Restore the cart saved in the browser (if any)
function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable: cart still works in memory */
    }
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = +items.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);

    return {
      items,
      count,
      total,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addToCart: (product, quantity = 1) => dispatch({ type: "ADD", product, quantity }),
      increase: (id) => dispatch({ type: "INCREASE", id }),
      decrease: (id) => dispatch({ type: "DECREASE", id }),
      remove: (id) => dispatch({ type: "REMOVE", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}