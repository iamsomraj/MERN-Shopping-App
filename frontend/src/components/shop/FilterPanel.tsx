import { useProductFilters } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { useShopParams } from '@/hooks/use-shop-params';
import { cn, formatPrice } from '@/lib/utils';
import { useState } from 'react';

type ShopParams = ReturnType<typeof useShopParams>;

function FilterOption({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted',
        active ? 'bg-accent font-medium text-accent-foreground' : 'text-muted-foreground'
      )}>
      <span>{label}</span>
      {count !== undefined && <span className='text-xs tabular-nums'>{count}</span>}
    </button>
  );
}

function PriceFilter({ query, update, bounds }: ShopParams & { bounds: { min: number; max: number } }) {
  const min = Math.floor(bounds.min);
  const max = Math.ceil(bounds.max);
  const [range, setRange] = useState<[number, number]>([query.minPrice ?? min, query.maxPrice ?? max]);

  return (
    <div className='space-y-4 px-2'>
      <Slider
        min={min}
        max={max}
        step={5}
        value={range}
        onValueChange={(value) => setRange([value[0]!, value[1]!])}
        onValueCommit={([low, high]) =>
          update({ minPrice: low! > min ? low : undefined, maxPrice: high! < max ? high : undefined })
        }
        aria-label='Price range'
      />
      <div className='flex justify-between text-xs text-muted-foreground tabular-nums'>
        <span>{formatPrice(range[0])}</span>
        <span>{formatPrice(range[1])}</span>
      </div>
    </div>
  );
}

export function FilterPanel(props: ShopParams) {
  const { query, update } = props;
  const { data } = useProductFilters();
  const hasFilters = Boolean(
    query.category || query.brand || query.minPrice || query.maxPrice || query.inStock || query.onSale || query.featured
  );

  if (!data) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton
            key={index}
            className='h-7'
          />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <h3 className='px-2 text-sm font-semibold'>Category</h3>
        <div className='space-y-0.5'>
          <FilterOption
            label='All categories'
            active={!query.category}
            onClick={() => update({ category: undefined })}
          />
          {data.categories.map((category) => (
            <FilterOption
              key={category.name}
              label={category.name}
              count={category.count}
              active={query.category === category.name}
              onClick={() => update({ category: category.name })}
            />
          ))}
        </div>
      </div>
      <Separator />
      <div className='space-y-3'>
        <h3 className='px-2 text-sm font-semibold'>Price</h3>
        <PriceFilter
          // Remount when the range changes elsewhere (chips, clear all) so the slider resets.
          key={`${query.minPrice}-${query.maxPrice}`}
          {...props}
          bounds={data.priceRange}
        />
      </div>
      <Separator />
      <div className='space-y-3 px-2'>
        <div className='flex items-center justify-between'>
          <Label htmlFor='filter-in-stock'>In stock only</Label>
          <Switch
            id='filter-in-stock'
            checked={Boolean(query.inStock)}
            onCheckedChange={(checked) => update({ inStock: checked })}
          />
        </div>
        <div className='flex items-center justify-between'>
          <Label htmlFor='filter-on-sale'>On sale</Label>
          <Switch
            id='filter-on-sale'
            checked={Boolean(query.onSale)}
            onCheckedChange={(checked) => update({ onSale: checked })}
          />
        </div>
      </div>
      <Separator />
      <div className='space-y-2'>
        <h3 className='px-2 text-sm font-semibold'>Brand</h3>
        <div className='max-h-64 space-y-0.5 overflow-y-auto'>
          <FilterOption
            label='All brands'
            active={!query.brand}
            onClick={() => update({ brand: undefined })}
          />
          {data.brands.map((brand) => (
            <FilterOption
              key={brand}
              label={brand}
              active={query.brand === brand}
              onClick={() => update({ brand })}
            />
          ))}
        </div>
      </div>
      {hasFilters && (
        <Button
          variant='outline'
          className='w-full'
          onClick={() =>
            update({
              category: undefined,
              brand: undefined,
              minPrice: undefined,
              maxPrice: undefined,
              inStock: undefined,
              onSale: undefined,
              featured: undefined,
            })
          }>
          Clear filters
        </Button>
      )}
    </div>
  );
}
