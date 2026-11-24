export default function BrandFilter({ brands, selected, onToggle }) {
  return (
    <section className="py-4">
      <h3 className="mb-3 font-semibold">Brand</h3>
      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {brands.map((brand) => (
          <li key={brand}>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(brand)}
                onChange={() => onToggle(brand)}
                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
              />
              {brand}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}