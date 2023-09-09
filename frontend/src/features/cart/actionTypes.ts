import { IProduct } from '@/types';

export type SetCartItemActionPayload = {
  product: IProduct;
};

export type DeleteCartItemActionPayload = {
  product: IProduct;
};
