import { type ProductSort, useProducts } from '@/api/products';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { PaginationNav } from '@/components/common/PaginationNav';
import { ProductGrid, ProductGridSkeleton } from '@/components/product/ProductGrid';
import { FilterPanel } from '@/components/shop/FilterPanel';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePageMeta } from '@/hooks/use-page-meta';
import { type ShopFilterKey, useShopParams } from '@/hooks/use-shop-params';
import { cn, formatPrice } from '@/lib/utils';
import { SearchX, SlidersHorizontal, X } from 'lucide-react';
import { Link } from 'react-router';

const SORT_LABELS: Record<ProductSort, string> = {
  featured: 'Featured',
  newest: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  rating: 'Top rated',
};

export default function ShopPage() {
  const shop = useShopParams();
  const { query, update, clear } = shop;
  const { data, isPending, isPlaceholderData, error, refetch } = useProducts(query);

  const title = query.keyword
    ? `Results for “${query.keyword}”`
    : query.onSale
      ? 'Deals'
      : query.featured
        ? 'Featured'
        : (query.category ?? 'All products');
  usePageMeta(title.replace(/[“”]/g, '"'), {
    description: query.category
      ? `Shop ${query.category.toLowerCase()} at One Stop EShop — free shipping over $100 and secure PayPal checkout.`
      : undefined,
  });

  const chips: Array<{ key: ShopFilterKey | 'price'; label: string }> = [];
  if (query.keyword) chips.push({ key: 'q', label: `“${query.keyword}”` });
  if (query.category) chips.push({ key: 'category', label: query.category });
  if (query.brand) chips.push({ key: 'brand', label: query.brand });
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const max = query.maxPrice !== undefined ? formatPrice(query.maxPrice) : 'any';
    chips.push({ key: 'price', label: `${formatPrice(query.minPrice ?? 0)} – ${max}` });
  }
  if (query.inStock) chips.push({ key: 'inStock', label: 'In stock' });
  if (query.onSale) chips.push({ key: 'onSale', label: 'On sale' });
  if (query.featured) chips.push({ key: 'featured', label: 'Featured' });

  const removeChip = (key: ShopFilterKey | 'price') =>
    key === 'price' ? update({ minPrice: undefined, maxPrice: undefined }) : update({ [key]: undefined });

  return (
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
            {query.category ? (
              <BreadcrumbLink asChild>
                <Link to='/shop'>Shop</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Shop</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {query.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{query.category}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>{title}</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            {data ? `${data.total} product${data.total === 1 ? '' : 's'}` : 'Loading products…'}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='outline'
                className='lg:hidden'>
                <SlidersHorizontal /> Filters
                {chips.length > 0 && <Badge className='ml-1 h-5 px-1.5'>{chips.length}</Badge>}
              </Button>
            </SheetTrigger>
            <SheetContent
              side='left'
              className='w-80 overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className='px-2 pb-6'>
                <FilterPanel {...shop} />
              </div>
            </SheetContent>
          </Sheet>
          <Select
            value={query.sort}
            onValueChange={(sort) => update({ sort: sort === 'featured' ? undefined : sort })}>
            <SelectTrigger
              className='w-48'
              aria-label='Sort products'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align='end'>
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className='mt-4 flex flex-wrap items-center gap-2'>
          {chips.map((chip) => (
            <Badge
              key={chip.key}
              variant='secondary'
              className='gap-1 rounded-full py-1 pr-1 pl-3'>
              {chip.label}
              <button
                type='button'
                onClick={() => removeChip(chip.key)}
                className='rounded-full p-0.5 hover:bg-background'
                aria-label={`Remove filter ${chip.label}`}>
                <X className='size-3' />
              </button>
            </Badge>
          ))}
          <Button
            variant='link'
            size='sm'
            onClick={clear}>
            Clear all
          </Button>
        </div>
      )}

      <div className='mt-8 grid gap-10 lg:grid-cols-[15rem_1fr]'>
        <aside
          className='hidden lg:block'
          aria-label='Filters'>
          <div className='sticky top-24'>
            <FilterPanel {...shop} />
          </div>
        </aside>
        <div className='space-y-10'>
          {error ? (
            <ErrorState
              error={error}
              onRetry={() => refetch()}
            />
          ) : isPending ? (
            <ProductGridSkeleton
              count={9}
              className='md:grid-cols-3 lg:grid-cols-3'
            />
          ) : data.products.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title='No products found'
              description='Try a different search or remove some filters.'
              action={<Button onClick={clear}>Clear filters</Button>}
            />
          ) : (
            <ProductGrid
              products={data.products}
              priorityCount={3}
              className={cn('lg:grid-cols-3', isPlaceholderData && 'opacity-60 transition-opacity')}
            />
          )}
          {data && (
            <PaginationNav
              page={data.page}
              pages={data.pages}
              onPageChange={(page) => update({ page })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
