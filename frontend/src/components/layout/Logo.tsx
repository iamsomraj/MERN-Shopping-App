import { cn } from '@/lib/utils';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn('flex items-center gap-2 font-semibold tracking-tight', className)}
      aria-label='One Stop EShop home'>
      <span className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm'>
        <ShoppingBag className='size-4' />
      </span>
      <span className='text-base'>
        One Stop <span className='text-primary'>EShop</span>
      </span>
    </Link>
  );
}
