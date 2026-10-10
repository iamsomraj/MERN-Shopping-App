import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import type { IProduct, IProductFilters, IProductPage, IReview, IReviewPage } from '@/types';
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type ProductSort = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface ProductQuery {
  keyword?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  featured?: boolean;
  onSale?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export const productKeys = {
  all: ['products'] as const,
  list: (query: ProductQuery) => ['products', 'list', query] as const,
  detail: (idOrSlug: string) => ['products', 'detail', idOrSlug] as const,
  related: (idOrSlug: string) => ['products', 'related', idOrSlug] as const,
  filters: ['products', 'filters'] as const,
  reviews: (id: string, page: number, viewer?: string) => ['products', 'reviews', id, page, viewer ?? 'guest'] as const,
};

export const productsQuery = (query: ProductQuery) =>
  queryOptions({
    queryKey: productKeys.list(query),
    queryFn: async () => (await api.get<IProductPage>('/products', { params: query })).data,
  });

export const productQuery = (idOrSlug: string) =>
  queryOptions({
    queryKey: productKeys.detail(idOrSlug),
    queryFn: async () => (await api.get<IProduct>(`/products/${encodeURIComponent(idOrSlug)}`)).data,
  });

export const useProducts = (query: ProductQuery, options: { enabled?: boolean } = {}) =>
  useQuery({ ...productsQuery(query), placeholderData: keepPreviousData, ...options });

export const useProduct = (idOrSlug: string) => useQuery({ ...productQuery(idOrSlug), enabled: Boolean(idOrSlug) });

export const useRelatedProducts = (idOrSlug: string) =>
  useQuery({
    queryKey: productKeys.related(idOrSlug),
    queryFn: async () => (await api.get<IProduct[]>(`/products/${encodeURIComponent(idOrSlug)}/related`)).data,
  });

export const productFiltersQuery = queryOptions({
  queryKey: productKeys.filters,
  queryFn: async () => (await api.get<IProductFilters>('/products/filters')).data,
  staleTime: 5 * 60 * 1000,
});

export const useProductFilters = () => useQuery(productFiltersQuery);

/** Products in the home page hero and featured grid. */
export const featuredQuery = { featured: true, limit: 8 } satisfies ProductQuery;

export const useProductReviews = (productId: string, page = 1) => {
  // Keyed by viewer: the response says whether the signed-in user has already reviewed.
  const viewer = useAuthStore((state) => state.user?._id);
  return useQuery({
    queryKey: productKeys.reviews(productId, page, viewer),
    queryFn: async () => (await api.get<IReviewPage>(`/products/${productId}/reviews`, { params: { page } })).data,
    placeholderData: keepPreviousData,
  });
};

export const useCreateReview = (productId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { rating: number; title?: string; comment: string }) =>
      (await api.post<IReview>(`/products/${productId}/reviews`, body)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
};
