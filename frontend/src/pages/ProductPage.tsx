import { useProduct, useRelatedProducts } from '@/api/products';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Section } from '@/components/home/Section';
import { PriceTag } from '@/components/product/PriceTag';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { QuantityStepper } from '@/components/product/QuantityStepper';
import { RatingStars } from '@/components/product/RatingStars';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { WishlistButton } from '@/components/product/WishlistButton';
import { ReviewSection } from '@/components/reviews/ReviewSection';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/use-page-meta';
import { ApiError } from '@/lib/api';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/pricing';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart';
import { useRecentStore } from '@/stores/recent';
import { PackageX, RotateCcw, ShieldCheck, ShoppingBag, Truck, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { toast } from 'sonner';

function StockStatus({ qty, isAvailable }: { qty: number; isAvailable: boolean }) {
  const [label, tone] = !isAvailable
    ? ['Currently unavailable', 'bg-muted-foreground']
    : qty <= 0
      ? ['Out of stock', 'bg-destructive']
      : qty <= 5
        ? [`Only ${qty} left — order soon`, 'bg-warning']
        : ['In stock, ready to ship', 'bg-success'];
  return (
    <p className='flex items-center gap-2 text-sm font-medium'>
      <span className={cn('size-2 rounded-full', tone)} />
      {label}
    </p>
  );
}

function ProductSkeleton() {
  return (
    <div className='container grid gap-10 py-8 lg:grid-cols-2'>
      <Skeleton className='aspect-square rounded-2xl' />
      <div className='space-y-4'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-9 w-3/4' />
        <Skeleton className='h-5 w-40' />
        <Skeleton className='h-9 w-32' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-11 w-full' />
      </div>
    </div>
  );
}

function ProductView({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const { data: product, isPending, error, refetch } = useProduct(slug);
  const { data: related } = useRelatedProducts(slug);
  const addToCart = useCartStore((state) => state.add);
  const setCartOpen = useCartStore((state) => state.setOpen);
  const addRecent = useRecentStore((state) => state.addProduct);
  const [qty, setQty] = useState(1);
  usePageMeta(product?.name, {
    description: product?.description,
    image: product?.image,
    jsonLd: product && {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.images.map((image) => new URL(image, 'https://one-stop-eshop.vercel.app').href),
      sku: product._id,
      category: product.category,
      ...(product.brand && { brand: { '@type': 'Brand', name: product.brand } }),
      ...(product.numReviews > 0 && {
        aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.numReviews },
      }),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: product.price.toFixed(2),
        availability:
          product.isAvailable && product.qtyInStock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        url: `https://one-stop-eshop.vercel.app/products/${product.slug}`,
      },
    },
  });

  useEffect(() => {
    if (product) addRecent(product);
  }, [product, addRecent]);

  if (isPending) return <ProductSkeleton />;
  if (error || !product) {
    return (
      <div className='container py-16'>
        {error instanceof ApiError && error.status === 404 ? (
          <EmptyState
            icon={PackageX}
            title='Product not found'
            description='It may have been removed or the link is incorrect.'
            action={
              <Button asChild>
                <Link to='/shop'>Continue shopping</Link>
              </Button>
            }
          />
        ) : (
          <ErrorState
            error={error}
            onRetry={() => refetch()}
          />
        )}
      </div>
    );
  }

  const purchasable = product.isAvailable && product.qtyInStock > 0;
  const maxQty = Math.min(product.qtyInStock, 99);

  const add = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} × ${product.name} to your cart`, {
      action: { label: 'View cart', onClick: () => setCartOpen(true) },
    });
  };

  const buyNow = () => {
    addToCart(product, qty);
    navigate('/checkout');
  };

  return (
    <div className='space-y-20 pb-8'>
      <div className='container py-8'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to='/'>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className='line-clamp-1'>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16'>
          <ProductGallery
            images={product.images.length ? product.images : [product.image]}
            name={product.name}
          />

          <div className='flex flex-col gap-6'>
            <div className='space-y-3'>
              <div className='flex flex-wrap items-center gap-2'>
                {product.brand && <span className='text-sm font-medium text-primary'>{product.brand}</span>}
                {product.isFeatured && <Badge variant='secondary'>Featured</Badge>}
              </div>
              <h1 className='text-3xl font-semibold tracking-tight text-balance sm:text-4xl'>{product.name}</h1>
              <a
                href='#reviews'
                className='inline-flex items-center gap-2 text-sm hover:underline'>
                <RatingStars
                  rating={product.rating}
                  starClassName='size-4'
                />
                <span className='text-muted-foreground'>
                  {product.numReviews
                    ? `${product.rating.toFixed(1)} · ${product.numReviews} review${product.numReviews === 1 ? '' : 's'}`
                    : 'No reviews yet'}
                </span>
              </a>
            </div>

            <PriceTag
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              size='lg'
              showSavings
            />

            {product.description && (
              <p className='leading-relaxed text-pretty text-muted-foreground'>{product.description}</p>
            )}

            <Separator />

            <div className='space-y-4'>
              <StockStatus
                qty={product.qtyInStock}
                isAvailable={product.isAvailable}
              />
              {purchasable && (
                <div className='flex items-center gap-3'>
                  <span className='text-sm font-medium'>Quantity</span>
                  <QuantityStepper
                    value={qty}
                    max={maxQty}
                    onChange={setQty}
                  />
                </div>
              )}
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button
                  size='lg'
                  className='flex-1'
                  disabled={!purchasable}
                  onClick={add}>
                  <ShoppingBag /> Add to cart
                </Button>
                <Button
                  size='lg'
                  variant='secondary'
                  className='flex-1'
                  disabled={!purchasable}
                  onClick={buyNow}>
                  <Zap /> Buy now
                </Button>
                <WishlistButton
                  product={product}
                  variant='full'
                />
              </div>
            </div>

            <ul className='grid gap-3 rounded-xl border bg-muted/40 p-4 text-sm'>
              <li className='flex items-center gap-3'>
                <Truck className='size-4 text-primary' /> Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
              </li>
              <li className='flex items-center gap-3'>
                <ShieldCheck className='size-4 text-primary' /> Secure checkout with PayPal
              </li>
              <li className='flex items-center gap-3'>
                <RotateCcw className='size-4 text-primary' /> Free 30-day returns
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='container'>
        <ReviewSection product={product} />
      </div>

      <Section
        title='You may also like'
        href={`/shop?category=${encodeURIComponent(product.category)}`}
        linkLabel={`More in ${product.category}`}>
        {related ? (
          related.length > 0 ? (
            <ProductGrid products={related} />
          ) : (
            <p className='text-sm text-muted-foreground'>No related products yet.</p>
          )
        ) : (
          <ProductGridSkeleton count={4} />
        )}
      </Section>

      <RecentlyViewed excludeId={product._id} />
    </div>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams();
  // Keyed so quantity and gallery state reset when navigating between products.
  return (
    <ProductView
      key={slug}
      slug={slug}
    />
  );
}
