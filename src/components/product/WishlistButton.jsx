import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistButton({ productId, className = "" }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      <Heart size={16} className={active ? "fill-red-500 text-red-500" : "text-slate-600"} />
    </button>
  );
}