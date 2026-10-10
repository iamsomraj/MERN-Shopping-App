import { productQuery } from '@/api/products';
import { ApiError } from '@/lib/api';
import { useCartStore } from '@/stores/cart';
import type { IProductSummary } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * The cart lives in the browser, so its products can be deleted, hidden, sold out or repriced
 * meanwhile. Re-checks every item against the API when the cart or checkout opens, and returns
 * whether that check is still running.
 */
export function useCartValidation() {
  const queryClient = useQueryClient();
  const itemKey = useCartStore((state) => state.items.map((item) => item._id).join(','));
  const [checkedKey, setCheckedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!itemKey) return;
    let cancelled = false;
    const { items, sync } = useCartStore.getState();

    void Promise.all(
      items.map(async (item) => {
        try {
          const product = await queryClient.fetchQuery({ ...productQuery(item._id), staleTime: 0 });
          return [item, product.isAvailable ? (product as IProductSummary) : null] as const;
        } catch (error) {
          // Gone for good → drop it; a network hiccup → keep the item and let checkout decide.
          return [item, error instanceof ApiError && error.status === 404 ? null : undefined] as const;
        }
      })
    ).then((results) => {
      if (cancelled) return;
      const fresh = new Map<string, IProductSummary | null>();
      const removed: string[] = [];
      let repriced = false;
      for (const [item, product] of results) {
        if (product === undefined) continue;
        fresh.set(item._id, product);
        if (!product || product.qtyInStock <= 0) removed.push(item.name);
        else if (product.price !== item.price || item.qty > product.qtyInStock) repriced = true;
      }
      sync(fresh);
      if (removed.length) toast.warning(`No longer available, removed from your cart: ${removed.join(', ')}`);
      if (repriced) toast.info('Prices or stock in your cart were updated.');
      setCheckedKey(
        useCartStore
          .getState()
          .items.map((item) => item._id)
          .join(',')
      );
    });

    return () => {
      cancelled = true;
    };
  }, [itemKey, queryClient]);

  return { isValidating: Boolean(itemKey) && checkedKey !== itemKey };
}
