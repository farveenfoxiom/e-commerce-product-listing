const BASE_URL = "https://dummyjson.com";

// Convert the API shape into the shape our UI uses
const normalize = (p) => {
  const discount = Math.round(p.discountPercentage || 0);
  return {
    id: p.id,
    name: p.title,
    description: p.description,
    category: p.category,
    brand: p.brand ?? "Generic",
    image: p.thumbnail,
    images: p.images?.length ? p.images : [p.thumbnail],
    price: p.price, // original price
    discountPercentage: discount,
    finalPrice: discount ? +(p.price * (1 - discount / 100)).toFixed(2) : p.price,
    rating: p.rating ?? 0,
    reviews: p.reviews ?? [],
    reviewCount: p.reviews?.length ?? 0,
    stock: p.stock ?? 0,
    shipping: p.shippingInformation,
    warranty: p.warrantyInformation,
    returnPolicy: p.returnPolicy,
  };
};

async function request(path) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`);
  } catch {
    throw new Error("Cannot reach the server. Check your internet connection.");
  }
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Product not found." : `Request failed (${res.status})`);
  }
  return res.json();
}

export async function fetchProducts(limit = 100) {
  const data = await request(`/products?limit=${limit}`);
  return data.products.map(normalize);
}

export async function fetchProductById(id) {
  return normalize(await request(`/products/${id}`));
}