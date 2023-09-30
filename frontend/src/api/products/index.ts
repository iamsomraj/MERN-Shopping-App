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

export const getProduct = async (id: string) => {
  const response = await serverAPI.get(`/products/${id}`);
  const data = response.data as IProduct;
  return data;
};

export const deleteProduct = async (id: string) => {
  const response = await serverAPI.delete(`/products/${id}`);
  const data = response.data as IProduct;
  return data;
};
