import { useAdminProducts, useToggleAvailability } from '@/api/admin';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/common/PageHeader';
import { PaginationNav } from '@/components/common/PaginationNav';
import { ProductImage } from '@/components/product/ProductImage';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import { cn, formatPrice } from '@/lib/utils';
import { Eye, EyeOff, MoreHorizontal, Pencil, Plus, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  usePageMeta('Products · Admin', { noindex: true });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const keyword = useDebouncedValue(search.trim(), 300);
  const { data, isPending, isPlaceholderData, error, refetch } = useAdminProducts(keyword, page);
  const { mutate: toggle } = useToggleAvailability();

  const toggleAvailability = (id: string, name: string, isAvailable: boolean) =>
    toggle(id, {
      onSuccess: () => toast.success(`${name} is now ${isAvailable ? 'hidden from' : 'visible in'} the store`),
      onError: (err) => toast.error(getErrorMessage(err)),
    });

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Products'
        description={data ? `${data.total} products in the catalog` : 'Manage your catalog'}
        actions={
          <Button asChild>
            <Link to='/admin/products/new'>
              <Plus /> Add product
            </Link>
          </Button>
        }
      />
      <div className='relative max-w-sm'>
        <Search className='absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder='Search by name, brand or category'
          className='pl-9'
          aria-label='Search products'
        />
      </div>
      {error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <div className={cn('rounded-xl border', isPlaceholderData && 'opacity-60')}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className='hidden md:table-cell'>Category</TableHead>
                <TableHead className='text-right'>Price</TableHead>
                <TableHead className='text-right'>Stock</TableHead>
                <TableHead className='hidden sm:table-cell'>Status</TableHead>
                <TableHead className='w-12'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending
                ? Array.from({ length: 8 }, (_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={6}>
                        <Skeleton className='h-10' />
                      </TableCell>
                    </TableRow>
                  ))
                : data.products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <ProductImage
                            src={product.image}
                            alt=''
                            tileClassName='w-10 shrink-0 rounded-md border'
                            className='p-1'
                          />
                          <div className='min-w-0'>
                            <Link
                              to={`/admin/products/${product._id}/edit`}
                              className='line-clamp-1 font-medium hover:underline'>
                              {product.name}
                            </Link>
                            <p className='text-xs text-muted-foreground'>{product.brand}</p>
                          </div>
                          {product.isFeatured && (
                            <Star
                              className='size-3.5 shrink-0 fill-amber-400 text-amber-400'
                              aria-label='Featured'
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='hidden md:table-cell'>{product.category}</TableCell>
                      <TableCell className='text-right tabular-nums'>{formatPrice(product.price)}</TableCell>
                      <TableCell
                        className={cn(
                          'text-right tabular-nums',
                          product.qtyInStock === 0 && 'font-medium text-destructive',
                          product.qtyInStock > 0 && product.qtyInStock <= 5 && 'text-amber-600 dark:text-amber-400'
                        )}>
                        {product.qtyInStock}
                      </TableCell>
                      <TableCell className='hidden sm:table-cell'>
                        {product.isAvailable ? (
                          <Badge
                            variant='outline'
                            className='border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'>
                            Active
                          </Badge>
                        ) : (
                          <Badge variant='secondary'>Hidden</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant='ghost'
                              size='icon-sm'
                              aria-label={`Actions for ${product.name}`}>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/products/${product._id}/edit`}>
                                <Pencil /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/products/${product.slug}`}>
                                <Eye /> View in store
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onSelect={() => toggleAvailability(product._id, product.name, product.isAvailable)}>
                              {product.isAvailable ? <EyeOff /> : <Eye />}
                              {product.isAvailable ? 'Hide from store' : 'Show in store'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
      {data && (
        <PaginationNav
          page={data.page}
          pages={data.pages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
