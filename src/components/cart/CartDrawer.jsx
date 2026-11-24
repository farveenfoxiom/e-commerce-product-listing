import { useCallback, useEffect, useState } from "react";
import { X, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/format";
import Button from "../ui/Button";
import CartItem from "./CartItem";
import CheckoutForm from "./CheckoutForm";

export default function CartDrawer() {
  const { items, total, count, isOpen, closeCart, increase, decrease, remove, clearCart } = useCart();
  const [view, setView] = useState("cart"); // "cart" | "checkout" | "success"
  const [orderId, setOrderId] = useState("");

  const handleClose = useCallback(() => {
    closeCart();
    setView("cart");
  },[closeCart]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, handleClose]);

  // Stop the page behind from scrolling
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOrder = () => {
    setOrderId(`ORD-${Date.now().toString().slice(-6)}`);
    clearCart();
    setView("success");
  };

  if (!isOpen) return null;

  const title = view === "checkout" ? "Checkout" : view === "success" ? "Order placed" : `Your cart (${count})`;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50" onClick={handleClose} aria-hidden="true" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={handleClose} aria-label="Close cart" className="rounded p-1 hover:bg-slate-100">
            <X />
          </button>
        </div>

        {view === "success" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <CheckCircle2 size={56} className="text-emerald-500" />
            <h3 className="text-xl font-semibold">Thank you for your order!</h3>
            <p className="text-slate-500">
              Your order number is <span className="font-semibold text-slate-900">{orderId}</span>.
            </p>
            <Button onClick={handleClose} className="mt-2">
              Continue shopping
            </Button>
          </div>
        )}

        {view === "checkout" && <CheckoutForm onSubmit={handleOrder} onBack={() => setView("cart")} />}

        {view === "cart" &&
          (items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <ShoppingBag size={48} className="text-slate-300" />
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-slate-500">Add a product to get started.</p>
              <Button onClick={handleClose}>Browse products</Button>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto px-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} onIncrease={increase} onDecrease={decrease} onRemove={remove} />
                ))}
              </ul>
              <div className="space-y-3 border-t border-slate-200 p-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <Button className="w-full" onClick={() => setView("checkout")}>
                  Proceed to checkout
                </Button>
                <Button variant="danger" className="w-full" onClick={clearCart}>
                  Clear cart
                </Button>
              </div>
            </>
          ))}
      </aside>
    </div>
  );
}