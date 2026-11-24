import { Check } from "lucide-react";

export default function BrandFilter({ brands, selected, onToggle }) {
  return (
    <section className="py-4">
      <h3 className="mb-3 font-semibold">Brand</h3>
      <ul className="max-h-48 space-y-2 overflow-y-auto pr-2">
        {brands.map((brand) => {
          const checked = selected.includes(brand);
          return (
            <li key={brand}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                {/* Real input stays for keyboard and screen readers */}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(brand)}
                  className="peer sr-only"
                />
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-1 ${
                    checked ? "border-blue-600 bg-blue-600" : "border-slate-400 bg-white"
                  }`}
                >
                  {checked && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
                {brand}
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}