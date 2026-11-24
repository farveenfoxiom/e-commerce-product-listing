import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import useProduct from "../hooks/useProduct";
import { useCart } from "../context/CartContext";
import { formatPrice, formatCategory } from "../utils/format";
import Badge from "../components/ui/Badge";
import Rating from "../components/ui/Rating";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import WishlistButton from "../components/product/WishlistButton";

function DetailsSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 md:grid-cols-2">
      <div className="aspect-square rounded-xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-24 rounded bg-slate-200" />
        <div className="h-8 w-1/4 rounded bg-slate-200" />
        <div className="h-11 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product, loading, error, retry } = useProduct(id);
  const { addToCart, openCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const content = () => {
    if (loading) return <DetailsSkeleton />;
    if (error) return <ErrorMessage message={error} onRetry={retry} />;

    const p = product;
    const outOfStock = p.stock <= 0;

    const handleAdd = () => {
      addToCart(p, quantity);
      openCart();
    };

    return (
      <>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {p.discountPercentage > 0 && (
                <span className="absolute left-3 top-3 z-10">
                  <Badge variant="discount">-{p.discountPercentage}%</Badge>
                </span>
              )}
              <img src={p.images[activeImage] ?? p.image} alt={p.name} className="aspect-square w-full object-contain" />
            </div>
            {p.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {p.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(i)}
                    aria-label={`Show image ${i + 1}`}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 ${
                      i === activeImage ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{formatCategory(p.category)}</Badge>
              <span className="text-sm text-slate-500">Brand: {p.brand}</span>
            </div>

            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-bold">{p.name}</h1>
              <WishlistButton productId={p.id} className="shrink-0 border border-slate-200" />
            </div>

            <Rating value={p.rating} count={p.reviewCount} />

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(p.finalPrice)}</span>
              {p.discountPercentage > 0 && (
                <span className="text-lg text-slate-400 line-through">{formatPrice(p.price)}</span>
              )}
            </div>

            <p className="text-slate-600">{p.description}</p>

            <div>
              {outOfStock ? (
                <Badge variant="warning">Out of stock</Badge>
              ) : p.stock <= 10 ? (
                <Badge variant="warning">Only {p.stock} left</Badge>
              ) : (
                <Badge variant="success">In stock</Badge>
              )}
            </div>

            {!outOfStock && (
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center rounded-lg border border-slate-300 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-2 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(p.stock, q + 1))}
                    disabled={quantity >= p.stock}
                    aria-label="Increase quantity"
                    className="p-2 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button onClick={handleAdd} className="flex-1 py-3 sm:flex-none sm:px-8">
                  <ShoppingCart size={18} /> Add to Cart
                </Button>
              </div>
            )}

            <ul className="space-y-1 border-t border-slate-200 pt-4 text-sm text-slate-600">
              {p.shipping && <li>Shipping: {p.shipping}</li>}
              {p.warranty && <li>Warranty: {p.warranty}</li>}
              {p.returnPolicy && <li>Returns: {p.returnPolicy}</li>}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        {p.reviews.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-semibold">Customer reviews</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.reviews.map((r, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                  <Rating value={r.rating} />
                  <p className="mt-2 text-sm">{r.comment}</p>
                  <p className="mt-2 text-xs text-slate-500">{r.reviewerName}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:underline">
        <ArrowLeft size={16} /> Back to shop
      </Link>
      {content()}
    </div>
  );
}