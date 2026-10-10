import { Progress } from '@/components/ui/progress';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { formatPrice } from '@/lib/utils';
import { Truck } from 'lucide-react';

export function FreeShippingProgress({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
  return (
    <div className='space-y-2 rounded-lg bg-muted/60 p-3'>
      <p className='flex items-center gap-2 text-sm'>
        <Truck className='size-4 text-primary' />
        {remaining > 0 ? (
          <span>
            Add <span className='font-semibold'>{formatPrice(remaining)}</span> more for free shipping
          </span>
        ) : (
          <span className='font-medium'>You&apos;ve unlocked free shipping!</span>
        )}
      </p>
      <Progress
        value={Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}
        className='h-1.5'
        aria-label='Progress towards free shipping'
      />
    </div>
  );
}
