import { QuantityStepper } from '@/components/product/QuantityStepper';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import type { ICartItem } from '@/types';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router';

export function CartLineItem({ item, onNavigate }: { item: ICartItem; onNavigate?: () => void }) {
  const { setQty, remove } = useCartStore();
  return (
    <div className='flex gap-4'>
      <Link
        to={`/products/${item.slug}`}
        onClick={onNavigate}
        className='w-20 shrink-0 overflow-hidden rounded-lg border sm:w-24'>
        <ProductImage
          src={item.image}
          alt={item.name}
          className='p-2'
        />
      </Link>
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <div className='flex items-start justify-between gap-2'>
          <Link
            to={`/products/${item.slug}`}
            onClick={onNavigate}
            className='line-clamp-2 text-sm font-medium hover:underline'>
            {item.name}
          </Link>
          <p className='text-sm font-semibold tabular-nums'>{formatPrice(item.price * item.qty)}</p>
        </div>
        <p className='text-xs text-muted-foreground'>
          {formatPrice(item.price)} each · {item.category}
        </p>
        <div className='mt-auto flex items-center justify-between pt-2'>
          <QuantityStepper
            size='sm'
            value={item.qty}
            max={Math.min(item.qtyInStock, 99)}
            onChange={(qty) => setQty(item._id, qty)}
          />
          <Button
            variant='ghost'
            size='icon-sm'
            onClick={() => remove(item._id)}
            aria-label={`Remove ${item.name}`}>
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
