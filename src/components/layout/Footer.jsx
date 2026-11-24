export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} ShopLogo. Product data from DummyJSON.
    </footer>
  );
}