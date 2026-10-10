import type { IProductSummary } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toProductSummary } from './cart';

const MAX_PRODUCTS = 8;
const MAX_SEARCHES = 5;

interface RecentState {
  products: IProductSummary[];
  searches: string[];
  addProduct: (product: IProductSummary) => void;
  addSearch: (term: string) => void;
  clearSearches: () => void;
}

/** Recently viewed products and recent searches, kept on this device only. */
export const useRecentStore = create<RecentState>()(
  persist(
    (set) => ({
      products: [],
      searches: [],
      addProduct: (product) =>
        set((state) => ({
          products: [toProductSummary(product), ...state.products.filter((p) => p._id !== product._id)].slice(
            0,
            MAX_PRODUCTS
          ),
        })),
      addSearch: (term) =>
        set((state) => {
          const value = term.trim();
          if (!value) return state;
          const rest = state.searches.filter((s) => s.toLowerCase() !== value.toLowerCase());
          return { searches: [value, ...rest].slice(0, MAX_SEARCHES) };
        }),
      clearSearches: () => set({ searches: [] }),
    }),
    { name: 'eshop:recent' }
  )
);
