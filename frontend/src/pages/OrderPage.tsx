import { useOrder } from '@/api/orders';
import { ErrorState } from '@/components/common/ErrorState';
import { OrderDetailView } from '@/components/order/OrderDetailView';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageMeta } from '@/hooks/use-page-meta';
import { orderRef } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

export function OrderDetailSkeleton() {
  return (
    <div className='space-y-8'>
      <Skeleton className='h-9 w-72' />
      <div className='grid gap-8 lg:grid-cols-[1fr_22rem]'>
        <Skeleton className='h-80 rounded-xl' />
        <Skeleton className='h-64 rounded-xl' />
      </div>
    </div>
  );
}

export default function OrderPage() {
  const { id = '' } = useParams();
  const { data: order, isPending, error, refetch } = useOrder(id);
  usePageMeta(`Order ${orderRef(id)}`, { noindex: true });

  return (
    <div className='container space-y-6 py-8'>
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='-ml-3'>
        <Link to='/orders'>
          <ArrowLeft /> All orders
        </Link>
      </Button>
      {isPending ? (
        <OrderDetailSkeleton />
      ) : error ? (
        <ErrorState
          error={error}
          onRetry={() => refetch()}
        />
      ) : (
        <OrderDetailView order={order} />
      )}
    </div>
  );
}
