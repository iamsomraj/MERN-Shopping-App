import { SetCurrentProductActionPayload, SetPageActionPayload, SetProductsActionPayload } from '@/features/product/actionTypes';
import { RootState } from '@/store';
import { IProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProductSliceInitialState {
  products: IProduct[];
  currentProduct: null | IProduct;
  page: number;
  pages: number;
}

const initialState: IProductSliceInitialState = {
  products: [],
  currentProduct: null,
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
    setPage: (state, action: PayloadAction<SetPageActionPayload>) => {
      state.page = action.payload.page;
    },
    setCurrenProduct: (state, action: PayloadAction<SetCurrentProductActionPayload>) => {
      state.currentProduct = action.payload.currentProduct;
    },
  },
});

export const { setProducts, setPage, setCurrenProduct } = productSlice.actions;

export const selectProducts = (state: RootState) => state.product.products;
export const selectPage = (state: RootState) => state.product.page;
export const selectPages = (state: RootState) => state.product.pages;
export const selectCurrentProduct = (state: RootState) => state.product.currentProduct;

export default productSlice.reducer;
