import type { IShippingAddress } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CheckoutState {
  shippingAddress: IShippingAddress | null;
  setShippingAddress: (address: IShippingAddress) => void;
  clearShippingAddress: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      shippingAddress: null,
      setShippingAddress: (shippingAddress) => set({ shippingAddress }),
      clearShippingAddress: () => set({ shippingAddress: null }),
    }),
    { name: 'eshop:checkout' }
  )
);
