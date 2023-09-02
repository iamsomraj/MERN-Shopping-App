import { configureStore } from '@reduxjs/toolkit';

import productReducer from '@/features/product/productSlice';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
