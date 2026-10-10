// Mirrors backend/src/utils/pricing.ts for display; the server recalculates every order.
export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING_PRICE = 9.99;

export const priceCart = (items: Array<{ price: number; qty: number }>) => {
  const itemsPrice = Math.round(items.reduce((acc, item) => acc + item.price * item.qty, 0) * 100) / 100;
  const shippingPrice = itemsPrice === 0 || itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_PRICE;
  return { itemsPrice, shippingPrice, totalPrice: Math.round((itemsPrice + shippingPrice) * 100) / 100 };
};

export const discountPercent = (price: number, compareAtPrice?: number | null) =>
  compareAtPrice && compareAtPrice > price ? Math.round((1 - price / compareAtPrice) * 100) : 0;
