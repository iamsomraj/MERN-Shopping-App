import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { IProduct } from '@/types';
import { ProductCard } from './ProductCard';

const gridClass = 'grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4';

interface ProductGridProps {
  products: IProduct[];
  className?: string;
  /** Number of leading cards whose images load eagerly. */
  priorityCount?: number;
}

export function ProductGrid({ products, className, priorityCount = 0 }: ProductGridProps) {
  return (
    <div className={cn(gridClass, className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn(gridClass, className)}
      aria-busy='true'
      aria-label='Loading products'>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className='space-y-3'>
          <Skeleton className='aspect-square rounded-xl' />
          <Skeleton className='h-3 w-1/3' />
          <Skeleton className='h-4 w-4/5' />
          <Skeleton className='h-4 w-1/4' />
        </div>
      ))}
    </div>
  );
}
