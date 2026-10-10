import { productQuery } from '@/api/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pages } from '@/lib/pages';
import { discountPercent } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import type { IProduct } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { PriceTag } from './PriceTag';
import { ProductImage } from './ProductImage';
import { RatingStars } from './RatingStars';
import { WishlistButton } from './WishlistButton';

interface ProductCardProps {
  product: IProduct;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const queryClient = useQueryClient();
  const add = useCartStore((state) => state.add);
  const discount = discountPercent(product.price, product.compareAtPrice);
  const unavailable = !product.isAvailable;
  const soldOut = product.qtyInStock <= 0;

  // Warm up the product page code and data before the click lands.
  const preload = () => {
    void pages.product();
    queryClient.setQueryData(productQuery(product.slug).queryKey, (cached) => cached ?? product);
  };

  const quickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    add(product);
    toast.success(`Added ${product.name} to your cart`);
  };

  return (
    <div
      onMouseEnter={preload}
      className={cn('group relative flex flex-col', className)}>
      <div className='relative overflow-hidden rounded-xl border'>
        <ProductImage
          src={product.image}
          alt=''
          priority={priority}
          className='transition-transform duration-500 ease-out group-hover:scale-105'
        />
        <div className='absolute top-3 left-3 flex flex-col items-start gap-1.5'>
          {discount > 0 && <Badge className='bg-rose-600 text-white'>-{discount}%</Badge>}
          {unavailable ? (
            <Badge variant='secondary'>Unavailable</Badge>
          ) : (
            soldOut && <Badge variant='secondary'>Sold out</Badge>
          )}
          {!unavailable && !soldOut && product.qtyInStock <= 5 && (
            <Badge
              variant='outline'
              className='bg-background/90'>
              Only {product.qtyInStock} left
            </Badge>
          )}
        </div>
        <WishlistButton
          product={product}
          className='absolute top-3 right-3 z-10'
        />
        {!unavailable && !soldOut && (
          <Button
            size='sm'
            onClick={quickAdd}
            aria-label={`Add ${product.name} to cart`}
            className='absolute right-3 bottom-3 z-10 rounded-full shadow-md transition-all sm:translate-y-2 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100'>
            <Plus /> <span className='hidden sm:inline'>Add</span>
          </Button>
        )}
      </div>
      <div className='flex flex-1 flex-col gap-1 px-0.5 pt-3'>
        <p className='text-xs text-muted-foreground'>
          {product.brand ? `${product.brand} · ` : ''}
          {product.category}
        </p>
        <h3 className='line-clamp-2 text-sm leading-snug font-medium'>
          {/* Stretched link: the whole card is clickable while the buttons stay separate controls. */}
          <Link
            to={`/products/${product.slug}`}
            onFocus={preload}
            className='group-hover:underline group-hover:underline-offset-4 after:absolute after:inset-0 after:rounded-xl after:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50'>
            {product.name}
          </Link>
        </h3>
        {product.numReviews > 0 && (
          <div className='flex items-center gap-1.5'>
            <RatingStars rating={product.rating} />
            <span className='text-xs text-muted-foreground'>({product.numReviews})</span>
          </div>
        )}
        <PriceTag
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          className='mt-auto pt-1'
        />
      </div>
    </div>
  );
}
