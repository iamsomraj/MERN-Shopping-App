import { useOrder } from '@/api/orders';
import { ErrorState } from '@/components/common/ErrorState';
import { OrderDetailView } from '@/components/order/OrderDetailView';
import { Button } from '@/components/ui/button';
import { usePageMeta } from '@/hooks/use-page-meta';
import { orderRef } from '@/lib/utils';
import { OrderDetailSkeleton } from '@/pages/OrderPage';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

export default function AdminOrderPage() {
  const { id = '' } = useParams();
  const { data: order, isPending, error, refetch } = useOrder(id);
  usePageMeta(`Order ${orderRef(id)} · Admin`, { noindex: true });

  return (
    <div className='space-y-6'>
      <Button
        asChild
        variant='ghost'
        size='sm'
        className='-ml-3'>
        <Link to='/admin/orders'>
          <ArrowLeft /> Orders
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
        <OrderDetailView
          order={order}
          admin
        />
      )}
    </div>
  );
}
