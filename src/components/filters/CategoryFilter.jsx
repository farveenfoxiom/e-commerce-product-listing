import { formatCategory } from "../../utils/format";

export default function CategoryFilter({ categories, selected, onSelect }) {
  const item = (active) =>
    `w-full whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition ${
      active ? "bg-blue-50 font-medium text-blue-700" : "hover:bg-slate-100"
    }`;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <h3 className="mb-3 font-semibold">Categories</h3>
      {/* Horizontal scroll on mobile, vertical list on desktop */}
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:block lg:max-h-[28rem] lg:space-y-1 lg:overflow-y-auto lg:overflow-x-visible lg:pb-0">
        <li className="shrink-0">
          <button onClick={() => onSelect("")} className={item(selected === "")}>
            All products
          </button>
        </li>
        {categories.map((c) => (
          <li key={c} className="shrink-0">
            <button onClick={() => onSelect(c)} className={item(selected === c)}>
              {formatCategory(c)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}