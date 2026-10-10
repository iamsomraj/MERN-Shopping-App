import { useMyOrders } from '@/api/orders';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/common/PageHeader';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/use-page-meta';
import { formatDate, formatPrice, orderRef } from '@/lib/utils';
import { ChevronRight, Package } from 'lucide-react';
import { Link } from 'react-router';

export default function OrdersPage() {
  usePageMeta('Orders', { noindex: true });
  const { data: orders, isPending, error, refetch } = useMyOrders();

  return (
    <div className='container space-y-8 py-8'>
      <PageHeader
        title='Your orders'
        description='Track, pay for and review your orders.'
      />
      {isPending ? (
        <div className='space-y-4'>
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton
              key={index}
              className='h-28 rounded-xl'
            />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title='No orders yet'
          description='When you place an order, it will show up here.'
          action={
            <Button asChild>
              <Link to='/shop'>Start shopping</Link>
            </Button>
          }
        />
      ) : (
        <ul className='space-y-4'>
          {orders.map((order) => {
            const count = order.products.reduce((acc, item) => acc + item.qty, 0);
            return (
              <li key={order._id}>
                <Link
                  to={`/orders/${order._id}`}
                  className='group flex flex-col gap-4 rounded-xl border p-4 transition-all hover:border-primary/40 hover:shadow-sm sm:flex-row sm:items-center'>
                  <div className='flex -space-x-3'>
                    {order.products.slice(0, 3).map((item) =>
                      item.image ? (
                        <ProductImage
                          key={item._id}
                          src={item.image}
                          alt=''
                          tileClassName='ring-background w-14 rounded-lg border ring-2'
                          className='p-1.5'
                        />
                      ) : null
                    )}
                  </div>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='font-medium'>{orderRef(order._id)}</p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className='line-clamp-1 text-sm text-muted-foreground'>
                      {order.products.map((item) => item.name).join(', ')}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDate(order.createdAt)} · {count} item{count === 1 ? '' : 's'}
                    </p>
                  </div>
                  <div className='flex items-center justify-between gap-4 sm:justify-end'>
                    {order.status === 'pending' && <span className='text-sm font-medium text-primary'>Pay now</span>}
                    <p className='font-semibold tabular-nums'>{formatPrice(order.totalPrice)}</p>
                    <ChevronRight className='size-4 text-muted-foreground transition-colors group-hover:text-foreground' />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
