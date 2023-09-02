import { serverAPI } from '@/config';
import { IProduct } from '@/types';

type ProductListResponseType = {
  products: IProduct[];
  page: number;
  pages: number;
};

export const getProducts = async (page: number) => {
  const response = await serverAPI.get(`/products/?page=${page}`);
  const data = response.data as ProductListResponseType;
  return data;
};
