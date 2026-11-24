# ShopLogo: E-Commerce Product Listing Page

A responsive product listing page built with React (Vite) and Tailwind CSS.
Product data is fetched from the public [DummyJSON](https://dummyjson.com) API (prices are in USD).

**Live demo:** <your link>

## Features

- Product listing with image, name, description, price, discount price and Add to Cart
- Search by name (debounced), category filter, price, brand and rating filters
- Price sorting (low to high, high to low), pagination (8 per page), grid/list view
- Shopping cart: add, increase/decrease, remove, item count and total (saved in localStorage)
- Wishlist, Deals page (15%+ off) and New Arrivals page
- Product details page with gallery, stock status, shipping info and reviews
- Checkout and contact forms with validation
- Loading skeletons, error state with retry, empty states
- Responsive: mobile, tablet and desktop

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173. For a production build: `npm run build`.

## Folder structure

```
src/
├── api/          API calls and data shaping
├── components/   cart, filters, layout, product, ui
├── context/      cart, wishlist and search state
├── hooks/        useProducts, useProduct, useDebounce, useForm, useProductFilters
├── pages/        ShopPage, ProductDetailsPage, ContactPage
├── utils/        formatting helpers
└── constants.js  page size and other settings
```

## Design decisions

- All API calls are in `src/api/productService.js`; components never call `fetch`.
- Cart state uses `useReducer` and Context; the cart and wishlist persist in localStorage.
- Filtering, sorting and pagination run in the browser on the fetched list, which suits a catalog of this size.
- Filter options (categories, brands, price range) are built from the API data, nothing is hardcoded.
- The API has no "new" field, so the 12 highest product ids count as New Arrivals.
- Checkout and contact forms are simulated; no data is sent anywhere.