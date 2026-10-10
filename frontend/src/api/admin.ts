import { api } from '@/lib/api';
import type { IAdminStats, IProduct, IProductPage } from '@/types';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productKeys } from './products';

export const adminKeys = {
  stats: ['admin', 'stats'] as const,
  products: (keyword: string, page: number) => ['admin', 'products', keyword, page] as const,
  imageLibrary: ['admin', 'image-library'] as const,
};

export interface ProductInput {
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice: number | null;
  qtyInStock: number;
  images: string[];
  isFeatured: boolean;
  isAvailable: boolean;
}

export const useAdminStats = () =>
  useQuery({ queryKey: adminKeys.stats, queryFn: async () => (await api.get<IAdminStats>('/admin/stats')).data });

export const useAdminProducts = (keyword: string, page: number) =>
  useQuery({
    queryKey: adminKeys.products(keyword, page),
    queryFn: async () =>
      (await api.get<IProductPage>('/admin/products', { params: { keyword: keyword || undefined, page } })).data,
    placeholderData: keepPreviousData,
  });

export const useImageLibrary = () =>
  useQuery({
    queryKey: adminKeys.imageLibrary,
    queryFn: async () => (await api.get<string[]>('/admin/image-library')).data,
    staleTime: Infinity,
  });

const useInvalidateProducts = () => {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: productKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['admin'] }),
    ]);
};

export const useSaveProduct = (id?: string) => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: async (body: ProductInput) =>
      (id ? await api.put<IProduct>(`/products/${id}`, body) : await api.post<IProduct>('/products', body)).data,
    onSuccess: invalidate,
  });
};

export const useToggleAvailability = () => {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: async (id: string) => (await api.delete<IProduct>(`/products/${id}`)).data,
    onSuccess: invalidate,
  });
};
