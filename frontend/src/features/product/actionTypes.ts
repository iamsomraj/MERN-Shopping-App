import { IProduct } from '@/types';

export type SetProductsActionPayload = {
  products: IProduct[];
  page: number;
  pages: number;
};

export type SetPageActionPayload = {
  page: number;
};

export type SetCurrentProductActionPayload = {
  currentProduct: IProduct;
};
