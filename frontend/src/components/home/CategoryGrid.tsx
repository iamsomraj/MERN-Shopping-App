import { ProductImage } from '@/components/product/ProductImage';
import { Skeleton } from '@/components/ui/skeleton';
import type { ICategory } from '@/types';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';

export function CategoryGrid({ categories }: { categories?: ICategory[] }) {
  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
      {categories
        ? categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className='group flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-md'>
              <ProductImage
                src={category.image}
                alt=''
                tileClassName='aspect-[4/3]'
                className='transition-transform duration-500 group-hover:scale-105'
              />
              <div className='flex items-center justify-between gap-2 p-3'>
                <div>
                  <p className='text-sm font-semibold'>{category.name}</p>
                  <p className='text-xs text-muted-foreground'>{category.count} products</p>
                </div>
                <ArrowUpRight className='size-4 text-muted-foreground transition-colors group-hover:text-primary' />
              </div>
            </Link>
          ))
        : Array.from({ length: 5 }, (_, index) => (
            <Skeleton
              key={index}
              className='aspect-[4/4] rounded-xl'
            />
          ))}
    </div>
  );
}
