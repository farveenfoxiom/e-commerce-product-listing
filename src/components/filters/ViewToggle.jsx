import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({ value, onChange }) {
  const btn = (active) =>
    `flex h-9 w-9 items-center justify-center rounded-lg border transition ${
      active
        ? "border-blue-200 bg-blue-50 text-blue-600"
        : "border-slate-300 bg-white text-slate-500 hover:bg-slate-100"
    }`;

  return (
    <div className="hidden gap-1 sm:flex" role="group" aria-label="Product view">
      <button onClick={() => onChange("grid")} aria-pressed={value === "grid"} aria-label="Grid view" className={btn(value === "grid")}>
        <LayoutGrid size={16} />
      </button>
      <button onClick={() => onChange("list")} aria-pressed={value === "list"} aria-label="List view" className={btn(value === "list")}>
        <List size={16} />
      </button>
    </div>
  );
}