import { Star } from "lucide-react";

export default function Rating({ value = 0, count }) {
  return (
    <div className="flex items-center gap-1 text-sm" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={14}
            className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}
          />
        ))}
      </div>
      {count != null && <span className="text-slate-500">({count})</span>}
    </div>
  );
}