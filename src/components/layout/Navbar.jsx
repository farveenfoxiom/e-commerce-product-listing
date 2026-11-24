import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Store } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useSearch } from "../../context/SearchContext";
import { useWishlist } from "../../context/WishlistContext";
import SearchBar from "../filters/SearchBar";

const NAV_LINKS = [
  { to: "/", label: "Shop", end: true },
  { to: "/deals", label: "Deals" },
  { to: "/new", label: "New Arrivals" },
  { to: "/contact", label: "Contact" },
];

// Pages that show the product list (search stays on these)
const LISTING_PATHS = ["/", "/deals", "/new", "/wishlist"];

const iconButton =
  "relative rounded-full p-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

function CountBadge({ count }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
      {count}
    </span>
  );
}

export default function Navbar() {
  const { count: cartCount, openCart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { search, setSearch } = useSearch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Searching from any non-listing page (details, contact) takes you to the shop
  const handleSearch = (value) => {
    setSearch(value);
    if (!LISTING_PATHS.includes(pathname)) navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <Store className="text-blue-600" /> ShopLogo
        </Link>

        {/* Own row on mobile (scrolls sideways), inline on desktop */}
        <nav className="order-4 -mx-4 flex w-full gap-6 overflow-x-auto px-4 text-sm font-medium lg:order-none lg:mx-0 lg:ml-6 lg:w-auto lg:px-0">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `shrink-0 whitespace-nowrap py-1 transition ${
                  isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="order-3 w-full lg:order-none lg:ml-auto lg:w-auto lg:max-w-sm lg:flex-1">
          <SearchBar value={search} onChange={handleSearch} />
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link to="/wishlist" className={iconButton} aria-label={`Wishlist, ${wishlistCount} items`}>
            <Heart />
            <CountBadge count={wishlistCount} />
          </Link>
          <button onClick={openCart} className={iconButton} aria-label={`Open cart, ${cartCount} items`}>
            <ShoppingCart />
            <CountBadge count={cartCount} />
          </button>
        </div>
      </div>
    </header>
  );
}