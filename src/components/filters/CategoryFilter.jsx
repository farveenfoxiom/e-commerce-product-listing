import { formatCategory } from "../../utils/format";

export default function CategoryFilter({ categories, selected, onSelect }) {
  const item = (active) =>
    `w-full rounded-lg px-3 py-2 text-left text-sm transition ${
      active ? "bg-blue-50 font-medium text-blue-700" : "hover:bg-slate-100"
    }`;

  return (
    <section className="py-4">
      <h3 className="mb-3 font-semibold">Categories</h3>
      <ul className="max-h-56 space-y-1 overflow-y-auto">
        <li>
          <button onClick={() => onSelect("")} className={item(selected === "")}>
            All products
          </button>
        </li>
        {categories.map((c) => (
          <li key={c}>
            <button onClick={() => onSelect(c)} className={item(selected === c)}>
              {formatCategory(c)}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}