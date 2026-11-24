import { Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../utils/format";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  const { id, name, image, price, quantity, stock } = item;

  const qtyBtn =
    "flex h-7 w-7 items-center justify-center rounded border border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <li className="flex gap-3 border-b border-slate-100 py-4">
      <img src={image} alt={name} className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 object-contain" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-medium">{name}</p>
          <button
            onClick={() => onRemove(id)}
            aria-label={`Remove ${name} from cart`}
            className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <p className="text-sm text-slate-500">{formatPrice(price)} each</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button onClick={() => onDecrease(id)} disabled={quantity <= 1} className={qtyBtn} aria-label="Decrease quantity">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button onClick={() => onIncrease(id)} disabled={quantity >= stock} className={qtyBtn} aria-label="Increase quantity">
              <Plus size={14} />
            </button>
          </div>
          <span className="font-semibold">{formatPrice(price * quantity)}</span>
        </div>

        {quantity >= stock && <p className="mt-1 text-xs text-amber-600">Maximum stock reached</p>}
      </div>
    </li>
  );
}