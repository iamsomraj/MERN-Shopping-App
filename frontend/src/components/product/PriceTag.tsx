import { discountPercent } from '@/lib/pricing';
import { cn, formatPrice } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  compareAtPrice?: number | null;
  size?: 'sm' | 'lg';
  showSavings?: boolean;
  className?: string;
}

export function PriceTag({ price, compareAtPrice, size = 'sm', showSavings, className }: PriceTagProps) {
  const discount = discountPercent(price, compareAtPrice);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-1', className)}>
      <span className={cn('font-semibold tabular-nums', size === 'lg' ? 'text-3xl tracking-tight' : 'text-base')}>
        {formatPrice(price)}
      </span>
      {discount > 0 && (
        <>
          <span
            className={cn('text-muted-foreground tabular-nums line-through', size === 'lg' ? 'text-lg' : 'text-sm')}>
            {formatPrice(compareAtPrice!)}
          </span>
          {showSavings && (
            <span className='text-sm font-medium text-success'>
              Save {formatPrice(compareAtPrice! - price)} ({discount}%)
            </span>
          )}
        </>
      )}
    </div>
  );
}
