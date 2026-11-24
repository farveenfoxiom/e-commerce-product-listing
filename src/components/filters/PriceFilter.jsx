import { formatPrice } from "../../utils/format";

export default function PriceFilter({ max, value, onChange }) {
  return (
    <section className="py-4">
      <h3 className="mb-3 font-semibold">Filter by price</h3>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={max === 0}
        aria-label="Maximum price"
        className="w-full accent-blue-600"
      />
      <div className="mt-1 flex justify-between text-sm text-slate-500">
        <span>{formatPrice(0)}</span>
        <span className="font-medium text-slate-900">Up to {formatPrice(value)}</span>
      </div>
    </section>
  );
}