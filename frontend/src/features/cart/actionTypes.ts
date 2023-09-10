import { ICartProduct } from '@/types';

export type SetCartItemActionPayload = {
  product: ICartProduct;
};

export type DeleteCartItemActionPayload = {
  product: ICartProduct;
};
