import type { ICartItem, IProductSummary } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_QTY = 99;

interface CartState {
  items: ICartItem[];
  isOpen: boolean;
  add: (product: IProductSummary, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setOpen: (isOpen: boolean) => void;
}

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(qty, stock, MAX_QTY));

export const toProductSummary = ({
  _id,
  slug,
  name,
  image,
  price,
  compareAtPrice,
  qtyInStock,
  category,
  rating,
  numReviews,
}: IProductSummary): IProductSummary => ({
  _id,
  slug,
  name,
  image,
  price,
  compareAtPrice,
  qtyInStock,
  category,
  rating,
  numReviews,
});

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item._id === product._id);
          const summary = toProductSummary(product);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item._id === product._id ? { ...summary, qty: clampQty(item.qty + qty, product.qtyInStock) } : item
              ),
            };
          }
          return { items: [...state.items, { ...summary, qty: clampQty(qty, product.qtyInStock) }] };
        }),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) => (item._id === id ? { ...item, qty: clampQty(qty, item.qtyInStock) } : item)),
        })),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item._id !== id) })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    { name: 'eshop:cart', partialize: ({ items }) => ({ items }) }
  )
);

export const useCartCount = () => useCartStore((state) => state.items.reduce((acc, item) => acc + item.qty, 0));
