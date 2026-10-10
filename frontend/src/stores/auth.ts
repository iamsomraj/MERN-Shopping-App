import { queryClient } from '@/lib/query-client';
import { useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';
import type { IAuthUser, IUser } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: IAuthUser | null;
  setUser: (user: IAuthUser) => void;
  /** Merges profile changes, keeping the current token. */
  updateUser: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUser: (user) => set((state) => (state.user ? { user: { ...state.user, ...user } } : state)),
      logout: () => {
        set({ user: null });
        // Don't leave the cart or shipping address for the next person on a shared device.
        useCartStore.getState().clear();
        useCheckoutStore.getState().clearShippingAddress();
        // Drop everything tied to the signed-out user; the public catalog can stay cached.
        queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'products' });
      },
    }),
    { name: 'eshop:auth' }
  )
);
