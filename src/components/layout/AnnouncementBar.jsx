import { Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-slate-100 bg-white px-4 py-2 text-center text-sm">
      <Truck size={16} className="shrink-0 text-blue-600" />
      <span>
        Free shipping on orders over <span className="font-semibold text-blue-600">$50</span>
      </span>
    </div>
  );
}