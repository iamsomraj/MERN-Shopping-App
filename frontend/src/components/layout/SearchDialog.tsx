import { useProductFilters, useProducts } from '@/api/products';
import { ProductImage } from '@/components/product/ProductImage';
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { formatPrice } from '@/lib/utils';
import { useRecentStore } from '@/stores/recent';
import { History, LayoutGrid, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Loaded lazily so cmdk only ships once someone searches. */
export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [term, setTerm] = useState('');
  const keyword = useDebouncedValue(term.trim(), 200);
  const navigate = useNavigate();
  const { searches, addSearch, clearSearches } = useRecentStore();
  const { data: filters } = useProductFilters();
  const { data, isFetching } = useProducts({ keyword, limit: 6 }, { enabled: open && keyword.length > 1 });
  const results = keyword.length > 1 ? (data?.products ?? []) : [];

  const go = (to: string) => {
    onOpenChange(false);
    setTerm('');
    navigate(to);
  };

  const searchAll = (value: string) => {
    addSearch(value);
    go(`/shop?q=${encodeURIComponent(value)}`);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Search products'
      description='Search the catalog by product, brand or category'
      commandProps={{ shouldFilter: false }}>
      <CommandInput
        value={term}
        onValueChange={setTerm}
        placeholder='Search products, brands, categories…'
      />
      <CommandList>
        {keyword.length > 1 ? (
          <>
            {results.length === 0 && (
              <div className='flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground'>
                {isFetching ? (
                  <>
                    <Loader2 className='size-4 animate-spin' /> Searching…
                  </>
                ) : (
                  <>No products match “{keyword}”.</>
                )}
              </div>
            )}
            {results.length > 0 && (
              <CommandGroup heading='Products'>
                {results.map((product) => (
                  <CommandItem
                    key={product._id}
                    value={product._id}
                    onSelect={() => {
                      addSearch(keyword);
                      go(`/products/${product.slug}`);
                    }}>
                    <ProductImage
                      src={product.image}
                      alt=''
                      tileClassName='w-10 shrink-0 rounded-md border'
                      className='p-1'
                    />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium'>{product.name}</p>
                      <p className='truncate text-xs text-muted-foreground'>{product.category}</p>
                    </div>
                    <span className='text-sm tabular-nums'>{formatPrice(product.price)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value={`search-all-${keyword}`}
                onSelect={() => searchAll(keyword)}>
                <Search /> See all results for “{keyword}”
              </CommandItem>
            </CommandGroup>
          </>
        ) : (
          <>
            {searches.length > 0 && (
              <CommandGroup heading='Recent searches'>
                {searches.map((search) => (
                  <CommandItem
                    key={search}
                    value={`recent-${search}`}
                    onSelect={() => searchAll(search)}>
                    <History /> {search}
                  </CommandItem>
                ))}
                <CommandItem
                  value='clear-recent'
                  onSelect={clearSearches}
                  className='text-xs text-muted-foreground'>
                  Clear recent searches
                </CommandItem>
              </CommandGroup>
            )}
            <CommandGroup heading='Categories'>
              {filters?.categories.map((category) => (
                <CommandItem
                  key={category.name}
                  value={`category-${category.name}`}
                  onSelect={() => go(`/shop?category=${encodeURIComponent(category.name)}`)}>
                  <LayoutGrid /> {category.name}
                  <span className='ml-auto text-xs text-muted-foreground'>{category.count}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
