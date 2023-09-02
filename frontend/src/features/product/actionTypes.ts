import { IProduct } from '@/types';

export type SetProductsActionPayload = {
  products: IProduct[];
  page: number;
  pages: number;
};
