const styles = {
  discount: "bg-red-500 text-white",
  info: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
};

export default function Badge({ children, variant = "info" }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
}