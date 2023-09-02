import { SetProductsActionPayload } from '@/features/product/actionTypes';
import { RootState } from '@/store';
import { IProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProductSliceInitialState {
  products: IProduct[];
  page: number;
  pages: number;
}

const initialState: IProductSliceInitialState = {
  products: [],
  page: 1,
  pages: 1,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<SetProductsActionPayload>) => {
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
  },
});

export const { setProducts } = productSlice.actions;

export const selectProducts = (state: RootState) => state.product.products;
export const selectPage = (state: RootState) => state.product.page;
export const selectPages = (state: RootState) => state.product.pages;

export default productSlice.reducer;
