import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Badge from "../ui/Badge";
import Rating from "../ui/Rating";
import Button from "../ui/Button";
import { formatPrice } from "../../utils/format";

export default function ProductCard({ product, onAddToCart }) {
  const { id, name, description, image, price, finalPrice, discountPercentage, rating, reviewCount, stock } = product;
  const outOfStock = stock <= 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:shadow-md">
      <Link to={`/product/${id}`} className="relative block bg-slate-100">
        {discountPercentage > 0 && (
          <span className="absolute left-3 top-3 z-10">
            <Badge variant="discount">-{discountPercentage}%</Badge>
          </span>
        )}
        <img src={image} alt={name} loading="lazy" className="aspect-square w-full object-contain" />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link to={`/product/${id}`} className="font-medium hover:text-blue-600">
          {name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{description}</p>
        <Rating value={rating} count={reviewCount} />

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
          {discountPercentage > 0 && (
            <span className="text-sm text-slate-400 line-through">{formatPrice(price)}</span>
          )}
        </div>

        <Button variant="soft" onClick={() => onAddToCart(product)} disabled={outOfStock}>
          <ShoppingCart size={16} /> {outOfStock ? "Out of stock" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}