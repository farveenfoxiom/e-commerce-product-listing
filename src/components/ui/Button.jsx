const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  soft: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  outline: "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
  danger: "text-red-600 hover:bg-red-50",
};

export default function Button({ variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}