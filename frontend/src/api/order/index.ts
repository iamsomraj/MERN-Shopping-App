import { serverAPI } from '@/config';
import { ICartProduct } from '@/types';

export const createOrder = async (products: ICartProduct[]) => {
  const response = await serverAPI.post(`/orders`, {
    products,
  });
  const data = response.data;
  return data;
};
