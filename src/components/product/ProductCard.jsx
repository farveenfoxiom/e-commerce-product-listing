import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Badge from "../ui/Badge";
import Rating from "../ui/Rating";
import Button from "../ui/Button";
import WishlistButton from "./WishlistButton";
import { formatPrice } from "../../utils/format";

export default function ProductCard({ product, onAddToCart, view = "grid" }) {
  const { id, name, description, image, price, finalPrice, discountPercentage, rating, reviewCount, stock, isNew } = product;
  const outOfStock = stock <= 0;
  const list = view === "list";

  return (
    <div
      className={`relative flex overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md ${
        list ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <Link to={`/product/${id}`} className={`relative block bg-slate-100 ${list ? "sm:w-56 sm:shrink-0" : ""}`}>
        <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1">
          {discountPercentage > 0 && <Badge variant="discount">-{discountPercentage}%</Badge>}
          {isNew && <Badge>NEW</Badge>}
        </div>
        <img src={image} alt={name} loading="lazy" className="aspect-square w-full object-contain" />
      </Link>

      <WishlistButton productId={id} className="absolute right-3 top-3 z-10" />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${id}`} className="font-medium hover:text-blue-600">
          {name}
        </Link>
        <p className={`text-sm text-slate-500 ${list ? "line-clamp-2 sm:line-clamp-3" : "line-clamp-2"}`}>
          {description}
        </p>
        <Rating value={rating} count={reviewCount} />

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
          {discountPercentage > 0 && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(price)}</span>
          )}
        </div>

        <Button
          variant="soft"
          onClick={() => onAddToCart(product)}
          disabled={outOfStock}
          className={list ? "sm:w-fit" : ""}
        >
          <ShoppingCart size={16} /> {outOfStock ? "Out of stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}