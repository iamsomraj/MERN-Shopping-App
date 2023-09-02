import { SetProductsActionPayload } from '@/features/product/actionTypes';
import { IProduct } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface IProductSliceInitialState {
  products: IProduct[];
}

const initialState: IProductSliceInitialState = {
  products: [],
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<SetProductsActionPayload>) => {
      state.products = action.payload.products;
    },
  },
});

export default productSlice.reducer;
