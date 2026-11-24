export default function ProductSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-square bg-slate-200" />
      <div className="space-y-2 p-2.5 sm:space-y-3 sm:p-4">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-200" />
        <div className="h-5 w-1/3 rounded bg-slate-200" />
        <div className="h-8 rounded bg-slate-200 sm:h-9" />
      </div>
    </div>
  );
}