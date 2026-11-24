import { Link } from "react-router-dom";
import { ShoppingCart, Store } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { count, openCart } = useCart();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Store className="text-blue-600" /> ShopLogo
        </Link>

        <button
          onClick={openCart}
          className="relative rounded-full p-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label={`Open cart, ${count} items`}
        >
          <ShoppingCart />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}