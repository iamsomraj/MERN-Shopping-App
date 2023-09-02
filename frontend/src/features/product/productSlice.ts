import { SetProductsActionPayload } from '@/features/product/actionTypes';
import { IProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProductSliceInitialState {
  products: IProduct[];
  page: number;
  pages: number;
}

const initialState: IProductSliceInitialState = {
  products: [],
  page: 0,
  pages: 0,
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

export default productSlice.reducer;
