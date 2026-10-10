import { ProductImage } from '@/components/product/ProductImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import type { IProduct } from '@/types';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

function HeroTile({ product, className }: { product?: IProduct; className?: string }) {
  if (!product) return <Skeleton className={className} />;
  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group relative block overflow-hidden rounded-2xl border bg-product-tile ${className}`}>
      <ProductImage
        src={product.image}
        alt={product.name}
        priority
        tileClassName='size-full aspect-auto bg-transparent'
        // Leave room at the bottom for the name/price caption.
        className='pb-16 transition-transform duration-500 group-hover:scale-105'
      />
      <div className='absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-lg bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur'>
        <span className='truncate font-medium'>{product.name}</span>
        <span className='shrink-0 font-semibold tabular-nums'>{formatPrice(product.price)}</span>
      </div>
    </Link>
  );
}

export function Hero({ products }: { products?: IProduct[] }) {
  const [first, second, third] = products ?? [];
  return (
    <section className='relative overflow-hidden border-b'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent'
      />
      <div className='relative container grid items-center gap-10 py-12 md:py-16 lg:grid-cols-2 lg:py-20'>
        <div className='animate-in space-y-6 duration-700 fade-in slide-in-from-bottom-4'>
          <Badge
            variant='outline'
            className='gap-1.5 rounded-full bg-background px-3 py-1'>
            <Sparkles className='size-3.5 text-primary' /> New season deals are live
          </Badge>
          <h1 className='text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
            Everything you love, <span className='text-primary'>in one place.</span>
          </h1>
          <p className='max-w-lg text-lg text-pretty text-muted-foreground'>
            Discover hand-picked tech, fashion and jewelry from brands you trust. Free shipping over $100 and secure
            checkout with PayPal.
          </p>
          <div className='flex flex-wrap gap-3'>
            <Button
              asChild
              size='lg'
              className='rounded-full'>
              <Link to='/shop'>
                Shop the collection <ArrowRight />
              </Link>
            </Button>
            <Button
              asChild
              size='lg'
              variant='outline'
              className='rounded-full'>
              <Link to='/shop?onSale=true'>Browse deals</Link>
            </Button>
          </div>
        </div>
        <div className='grid h-80 grid-cols-2 grid-rows-2 gap-3 sm:h-96 lg:h-[28rem]'>
          <HeroTile
            product={first}
            className='row-span-2 h-full'
          />
          <HeroTile
            product={second}
            className='h-full'
          />
          <HeroTile
            product={third}
            className='h-full'
          />
        </div>
      </div>
    </section>
  );
}
