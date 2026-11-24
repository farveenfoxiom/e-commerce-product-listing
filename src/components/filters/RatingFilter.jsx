import Rating from "../ui/Rating";

const OPTIONS = [4, 3, 2, 1];

export default function RatingFilter({ value, onChange }) {
  return (
    <section className="py-4">
      <h3 className="mb-3 font-semibold">Rating</h3>
      <ul className="space-y-1">
        {OPTIONS.map((n) => (
          <li key={n}>
            <button
              onClick={() => onChange(value === n ? 0 : n)} // click again to clear
              aria-pressed={value === n}
              className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                value === n ? "bg-blue-50 font-medium text-blue-700" : "hover:bg-slate-100"
              }`}
            >
              <Rating value={n} />
              <span>& up</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}