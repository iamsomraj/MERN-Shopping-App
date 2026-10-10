import { useAdminStats } from '@/api/admin';
import { SalesChart } from '@/components/admin/SalesChart';
import { StatCard } from '@/components/admin/StatCard';
import { ErrorState } from '@/components/common/ErrorState';
import { PageHeader } from '@/components/common/PageHeader';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePageMeta } from '@/hooks/use-page-meta';
import { STATUS_LABEL } from '@/lib/order-status';
import { formatDate, formatPrice, orderRef } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { Link } from 'react-router';

const STATUSES: OrderStatus[] = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function DashboardPage() {
  usePageMeta('Admin dashboard', { noindex: true });
  const { data, isPending, error, refetch } = useAdminStats();

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  const last30 = data?.salesByDay.reduce((acc, day) => acc + day.total, 0) ?? 0;
  const ordersLast30 = data?.salesByDay.reduce((acc, day) => acc + day.orders, 0) ?? 0;

  return (
    <div className='space-y-8'>
      <PageHeader
        title='Dashboard'
        description='How the store is doing at a glance.'
      />
      {isPending ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton
              key={index}
              className='h-32 rounded-xl'
            />
          ))}
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          <StatCard
            title='Total revenue'
            value={formatPrice(data.revenue)}
            hint={`${formatPrice(last30)} in the last 30 days`}
            icon={DollarSign}
          />
          <StatCard
            title='Orders'
            value={data.ordersCount}
            hint={`${data.ordersByStatus.paid ?? 0} waiting to ship`}
            icon={ShoppingBag}
          />
          <StatCard
            title='Customers'
            value={data.usersCount}
            hint='Registered accounts'
            icon={Users}
          />
          <StatCard
            title='Products'
            value={data.productsCount}
            hint={`${data.lowStock.length} low on stock`}
            icon={Package}
          />
        </div>
      )}

      <div className='grid gap-4 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>
              Last 30 days · {ordersLast30} paid order{ordersLast30 === 1 ? '' : 's'}
            </CardDescription>
          </CardHeader>
          <CardContent>{data ? <SalesChart data={data.salesByDay} /> : <Skeleton className='h-64' />}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders by status</CardTitle>
            <CardDescription>Across all time</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {STATUSES.map((status) => {
              const count = data?.ordersByStatus[status] ?? 0;
              return (
                <div
                  key={status}
                  className='space-y-1.5'>
                  <div className='flex items-center justify-between text-sm'>
                    <span>{STATUS_LABEL[status]}</span>
                    <span className='text-muted-foreground tabular-nums'>{count}</span>
                  </div>
                  <Progress
                    value={data?.ordersCount ? (count / data.ordersCount) * 100 : 0}
                    className='h-1.5'
                    aria-label={`${STATUS_LABEL[status]} orders`}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 xl:grid-cols-3'>
        <Card className='xl:col-span-2'>
          <CardHeader>
            <CardTitle>Recent orders</CardTitle>
            <CardAction>
              <Button
                asChild
                variant='outline'
                size='sm'>
                <Link to='/admin/orders'>View all</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className='hidden sm:table-cell'>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className='font-medium hover:underline'>
                        {orderRef(order._id)}
                      </Link>
                    </TableCell>
                    <TableCell className='max-w-32 truncate'>{order.user?.name ?? 'Deleted user'}</TableCell>
                    <TableCell className='hidden text-muted-foreground sm:table-cell'>
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{formatPrice(order.totalPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Low stock</CardTitle>
            <CardDescription>5 or fewer units left</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.lowStock.length === 0 ? (
              <p className='text-sm text-muted-foreground'>Everything is well stocked.</p>
            ) : (
              <ul className='space-y-3'>
                {data?.lowStock.map((product) => (
                  <li
                    key={product._id}
                    className='flex items-center gap-3'>
                    <ProductImage
                      src={product.image}
                      alt=''
                      tileClassName='w-10 shrink-0 rounded-md border'
                      className='p-1'
                    />
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      className='min-w-0 flex-1 truncate text-sm hover:underline'>
                      {product.name}
                    </Link>
                    <span
                      className={
                        product.qtyInStock === 0
                          ? 'text-sm font-medium text-destructive'
                          : 'text-sm font-medium text-amber-600 dark:text-amber-400'
                      }>
                      {product.qtyInStock === 0 ? 'Sold out' : `${product.qtyInStock} left`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
