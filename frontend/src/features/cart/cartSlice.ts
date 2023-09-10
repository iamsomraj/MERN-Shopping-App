import { DeleteCartItemActionPayload, SetCartItemActionPayload } from '@/features/cart/actionTypes';
import { RootState } from '@/store';
import { ICartProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ICartSliceInitialState {
  showDrawer: boolean;
  cart: ICartProduct[];
}

const getCartFromStorage = () => {
  return JSON.parse(localStorage.getItem('cart') as string) as ICartProduct[];
};

const storeCartToStorage = (cart: ICartProduct[]) => {
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
      if (state.cart.length > 0) {
        const filteredCart = state.cart.filter((prod) => prod._id != action.payload.product._id);
        state.cart = [...filteredCart, action.payload.product];
      } else {
        state.cart = [action.payload.product];
      }
      storeCartToStorage(state.cart);
    },
    removeFromCart: (state, action: PayloadAction<DeleteCartItemActionPayload>) => {
      if (state.cart.length === 0) {
        return;
      }
      const filteredCart = state.cart.filter((prod) => prod._id != action.payload.product._id);
      state.cart = [...filteredCart];
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

export const { addToCart, openDrawer, closeDrawer, clearCart, removeFromCart } = cartSlice.actions;

export const selectCart = (state: RootState) => state.cart.cart;
export const selectShowDrawer = (state: RootState) => state.cart.showDrawer;

export default cartSlice.reducer;
