import { SetCartItemActionPayload } from '@/features/cart/actionTypes';
import { RootState } from '@/store';
import { IProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ICartSliceInitialState {
  showDrawer: boolean;
  cart: IProduct[];
}

const getCartFromStorage = () => {
  return JSON.parse(localStorage.getItem('cart') as string) as IProduct[];
};

const storeCartToStorage = (cart: IProduct[]) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const storedCart = getCartFromStorage();

const initialState: ICartSliceInitialState = {
  showDrawer: false,
  cart: storedCart || [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<SetCartItemActionPayload>) => {
      state.cart = [...state.cart, action.payload.product];
      storeCartToStorage(state.cart);
    },
    clearCart: (state) => {
      state.cart = [];
      storeCartToStorage(state.cart);
    },
    openDrawer: (state) => {
      state.showDrawer = true;
    },
    closeDrawer: (state) => {
      state.showDrawer = false;
    },
  },
});

export const { addToCart, openDrawer, closeDrawer, clearCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectShowDrawer = (state: RootState) => state.cart.showDrawer;

export default cartSlice.reducer;
