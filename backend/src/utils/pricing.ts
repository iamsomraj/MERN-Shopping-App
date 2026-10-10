export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING_PRICE = 9.99;

export const roundMoney = (value: number): number => Math.round(value * 100) / 100;

/** Order totals; the frontend mirrors these rules for display, but the server is authoritative. */
export const priceOrder = (items: Array<{ price: number; qty: number }>) => {
  const itemsPrice = roundMoney(items.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = itemsPrice >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_PRICE;
  return { itemsPrice, shippingPrice, totalPrice: roundMoney(itemsPrice + shippingPrice) };
};
