import { Separator } from '@/components/ui/separator';
import { cn, formatPrice } from '@/lib/utils';
import type { ReactNode } from 'react';

interface OrderSummaryProps {
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  itemCount?: number;
  children?: ReactNode;
  className?: string;
}

export function OrderSummary({
  itemsPrice,
  shippingPrice,
  totalPrice,
  itemCount,
  children,
  className,
}: OrderSummaryProps) {
  return (
    <div className={cn('space-y-4 rounded-xl border bg-card p-5 shadow-xs', className)}>
      <h2 className='font-semibold'>Order summary</h2>
      <dl className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <dt className='text-muted-foreground'>
            Subtotal{itemCount !== undefined && ` (${itemCount} item${itemCount === 1 ? '' : 's'})`}
          </dt>
          <dd className='tabular-nums'>{formatPrice(itemsPrice)}</dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted-foreground'>Shipping</dt>
          <dd className='tabular-nums'>
            {shippingPrice === 0 ? <span className='font-medium text-success'>Free</span> : formatPrice(shippingPrice)}
          </dd>
        </div>
        <div className='flex justify-between'>
          <dt className='text-muted-foreground'>Taxes</dt>
          <dd className='text-muted-foreground'>Included</dd>
        </div>
      </dl>
      <Separator />
      <div className='flex items-baseline justify-between'>
        <span className='font-semibold'>Total</span>
        <span className='text-xl font-semibold tabular-nums'>{formatPrice(totalPrice)}</span>
      </div>
      {children}
    </div>
  );
}
