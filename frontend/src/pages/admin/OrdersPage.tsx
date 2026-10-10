import { useAdminOrders } from '@/api/orders';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/common/PageHeader';
import { PaginationNav } from '@/components/common/PaginationNav';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePageMeta } from '@/hooks/use-page-meta';
import { cn, formatDate, formatPrice, orderRef } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { ChevronRight, Inbox } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';

const TABS: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'To ship' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  usePageMeta('Orders · Admin', { noindex: true });
  const [params, setParams] = useSearchParams();
  const tab = (params.get('status') as OrderStatus | null) ?? 'all';
  const status = tab === 'all' ? undefined : tab;
  const page = Number(params.get('page')) || 1;
  const { data, isPending, isPlaceholderData, error, refetch } = useAdminOrders(status, page);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Orders'
        description='Ship paid orders and keep customers up to date.'
      />
      <Tabs
        value={tab}
        onValueChange={(value) => setParams(value === 'all' ? {} : { status: value })}>
        <div className='-mx-1 overflow-x-auto px-1'>
          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>
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
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className='hidden md:table-cell'>Date</TableHead>
                <TableHead className='hidden sm:table-cell'>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Total</TableHead>
                <TableHead className='w-24'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }, (_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <Skeleton className='h-8' />
                    </TableCell>
                  </TableRow>
                ))
              ) : data.orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className='h-40 text-center text-muted-foreground'>
                    <Inbox className='mx-auto mb-2 size-6' />
                    No orders here.
                  </TableCell>
                </TableRow>
              ) : (
                data.orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className='font-medium'>{orderRef(order._id)}</TableCell>
                    <TableCell>
                      <p className='max-w-40 truncate'>{order.user?.name ?? 'Deleted user'}</p>
                      <p className='max-w-40 truncate text-xs text-muted-foreground'>{order.user?.email}</p>
                    </TableCell>
                    <TableCell className='hidden text-muted-foreground md:table-cell'>
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {order.products.reduce((acc, item) => acc + item.qty, 0)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{formatPrice(order.totalPrice)}</TableCell>
                    <TableCell className='text-right'>
                      <Button
                        asChild
                        variant={order.status === 'paid' ? 'default' : 'ghost'}
                        size='sm'>
                        <Link to={`/admin/orders/${order._id}`}>
                          {order.status === 'paid' ? 'Ship' : 'View'} <ChevronRight />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {data && (
        <PaginationNav
          page={data.page}
          pages={data.pages}
          onPageChange={(next) => setParams({ ...(status && { status }), page: String(next) })}
        />
      )}
    </div>
  );
}
