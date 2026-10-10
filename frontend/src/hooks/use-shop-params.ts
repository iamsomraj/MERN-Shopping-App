import type { ProductQuery, ProductSort } from '@/api/products';
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';

const SORTS: ProductSort[] = ['featured', 'newest', 'price-asc', 'price-desc', 'rating'];

const toNumber = (value: string | null) => {
  if (value === null || value === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
};

export type ShopFilterKey = 'q' | 'category' | 'brand' | 'minPrice' | 'maxPrice' | 'inStock' | 'featured' | 'onSale';

/** Shop filters live in the URL so results are shareable and survive reloads. */
export function useShopParams() {
  const [params, setParams] = useSearchParams();

  const query = useMemo<ProductQuery>(() => {
    const sort = params.get('sort') as ProductSort | null;
    return {
      keyword: params.get('q') || undefined,
      category: params.get('category') || undefined,
      brand: params.get('brand') || undefined,
      minPrice: toNumber(params.get('minPrice')),
      maxPrice: toNumber(params.get('maxPrice')),
      inStock: params.get('inStock') === 'true' || undefined,
      featured: params.get('featured') === 'true' || undefined,
      onSale: params.get('onSale') === 'true' || undefined,
      sort: sort && SORTS.includes(sort) ? sort : 'featured',
      page: toNumber(params.get('page')) || 1,
    };
  }, [params]);

  /** Updates params; any change other than the page resets to page 1. */
  const update = useCallback(
    (changes: Partial<Record<ShopFilterKey | 'sort' | 'page', string | number | boolean | undefined>>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          for (const [key, value] of Object.entries(changes)) {
            if (value === undefined || value === '' || value === false) next.delete(key);
            else next.set(key, String(value));
          }
          if (!('page' in changes)) next.delete('page');
          return next;
        },
        { preventScrollReset: 'page' in changes ? false : true }
      );
    },
    [setParams]
  );

  const clear = useCallback(() => setParams({}), [setParams]);

  return { query, update, clear };
}
