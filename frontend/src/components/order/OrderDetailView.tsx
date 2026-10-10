import { useCancelOrder, usePaymentConfig, useUpdateOrderStatus } from '@/api/orders';
import { ProductImage } from '@/components/product/ProductImage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime, formatPrice, orderRef } from '@/lib/utils';
import type { IOrder } from '@/types';
import { CreditCard, MapPin, PackageCheck, Truck, XCircle } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { AddressBlock } from './AddressBlock';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderSummary } from './OrderSummary';
import { OrderTimeline } from './OrderTimeline';

const PayPalPayment = lazy(() => import('./PayPalPayment'));

function ConfirmButton({
  label,
  title,
  description,
  icon: Icon,
  variant = 'default',
  onConfirm,
  disabled,
}: {
  label: string;
  title: string;
  description: string;
  icon: typeof Truck;
  variant?: 'default' | 'outline' | 'destructive';
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          disabled={disabled}
          className='w-full'>
          <Icon /> {label}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Go back</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{label}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PaymentPanel({ order }: { order: IOrder }) {
  const { data: config, isPending } = usePaymentConfig();
  const { mutate: cancel, isPending: cancelling } = useCancelOrder(order._id);

  return (
    <div className='space-y-4 rounded-xl border bg-card p-5 shadow-xs'>
      <div>
        <h2 className='flex items-center gap-2 font-semibold'>
          <CreditCard className='size-4 text-primary' /> Complete your payment
        </h2>
        <p className='mt-1 text-sm text-muted-foreground'>
          Pay {formatPrice(order.totalPrice)} securely with PayPal or a card.
        </p>
      </div>
      {isPending ? (
        <Skeleton className='h-24 w-full' />
      ) : config?.paypalClientId ? (
        <Suspense fallback={<Skeleton className='h-24 w-full' />}>
          <PayPalPayment
            order={order}
            config={config}
          />
        </Suspense>
      ) : (
        <p className='rounded-lg bg-muted p-3 text-sm text-muted-foreground'>
          PayPal isn&apos;t configured on this server. Set <code>PAYPAL_CLIENT_ID</code> in the backend to enable
          payments.
        </p>
      )}
      <ConfirmButton
        label='Cancel order'
        title='Cancel this order?'
        description='The order will be cancelled and cannot be paid for afterwards.'
        icon={XCircle}
        variant='outline'
        disabled={cancelling}
        onConfirm={() =>
          cancel(undefined, {
            onSuccess: () => toast.success('Order cancelled'),
            onError: (error) => toast.error(getErrorMessage(error)),
          })
        }
      />
    </div>
  );
}

function AdminActions({ order }: { order: IOrder }) {
  const { mutate, isPending } = useUpdateOrderStatus();
  const setStatus = (status: 'shipped' | 'delivered' | 'cancelled') =>
    mutate(
      { id: order._id, status },
      {
        onSuccess: () => toast.success(`Order marked as ${status}`),
        onError: (error) => toast.error(getErrorMessage(error)),
      }
    );

  if (order.status === 'delivered' || order.status === 'cancelled') return null;
  return (
    <div className='space-y-3 rounded-xl border bg-card p-5 shadow-xs'>
      <h2 className='font-semibold'>Fulfilment</h2>
      {order.status === 'paid' && (
        <ConfirmButton
          label='Mark as shipped'
          title='Mark this order as shipped?'
          description='The customer will see the order as on its way.'
          icon={Truck}
          disabled={isPending}
          onConfirm={() => setStatus('shipped')}
        />
      )}
      {order.status === 'shipped' && (
        <ConfirmButton
          label='Mark as delivered'
          title='Mark this order as delivered?'
          description='This completes the order.'
          icon={PackageCheck}
          disabled={isPending}
          onConfirm={() => setStatus('delivered')}
        />
      )}
      {(order.status === 'pending' || order.status === 'paid') && (
        <ConfirmButton
          label='Cancel order'
          title='Cancel this order?'
          description={
            order.status === 'paid'
              ? 'The order has been paid. Remember to refund the customer in PayPal.'
              : 'The customer will no longer be able to pay for this order.'
          }
          icon={XCircle}
          variant='outline'
          disabled={isPending}
          onConfirm={() => setStatus('cancelled')}
        />
      )}
      {order.status === 'pending' && (
        <p className='text-xs text-muted-foreground'>Waiting for the customer to pay before it can ship.</p>
      )}
    </div>
  );
}

export function OrderDetailView({ order, admin = false }: { order: IOrder; admin?: boolean }) {
  const itemCount = order.products.reduce((acc, item) => acc + item.qty, 0);
  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Order {orderRef(order._id)}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className='text-sm text-muted-foreground'>
            Placed {formatDateTime(order.createdAt)}
            {admin && order.user && ` by ${order.user.name} (${order.user.email})`}
          </p>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-[1fr_22rem]'>
        <div className='space-y-8'>
          <section className='rounded-xl border'>
            <h2 className='border-b p-4 font-semibold'>Items ({itemCount})</h2>
            <ul className='divide-y'>
              {order.products.map((item) => (
                <li
                  key={item._id}
                  className='flex items-center gap-4 p-4'>
                  {item.image && (
                    <ProductImage
                      src={item.image}
                      alt=''
                      tileClassName='w-14 shrink-0 rounded-md border'
                      className='p-1.5'
                    />
                  )}
                  <div className='min-w-0 flex-1'>
                    <Link
                      to={`/products/${item.product}`}
                      className='line-clamp-1 text-sm font-medium hover:underline'>
                      {item.name}
                    </Link>
                    <p className='text-xs text-muted-foreground'>
                      {item.qty} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <p className='text-sm font-medium tabular-nums'>{formatPrice(item.qty * item.price)}</p>
                </li>
              ))}
            </ul>
          </section>

          <div className='grid gap-6 md:grid-cols-2'>
            <section className='rounded-xl border p-5'>
              <h2 className='mb-5 font-semibold'>Order status</h2>
              <OrderTimeline order={order} />
            </section>
            {order.shippingAddress && (
              <section className='h-fit rounded-xl border p-5'>
                <h2 className='flex items-center gap-2 font-semibold'>
                  <MapPin className='size-4 text-primary' /> Shipping address
                </h2>
                <AddressBlock
                  address={order.shippingAddress}
                  className='mt-3'
                />
                {order.paymentResult && (
                  <p className='mt-4 border-t pt-4 text-xs text-muted-foreground'>
                    PayPal reference <span className='font-mono text-foreground'>{order.paymentResult.id}</span>
                  </p>
                )}
              </section>
            )}
          </div>
        </div>

        <div className='space-y-4 lg:sticky lg:top-24 lg:h-fit'>
          <OrderSummary
            itemsPrice={order.itemsPrice || order.totalPrice}
            shippingPrice={order.shippingPrice}
            totalPrice={order.totalPrice}
            itemCount={itemCount}
          />
          {admin ? <AdminActions order={order} /> : order.status === 'pending' && <PaymentPanel order={order} />}
        </div>
      </div>
    </div>
  );
}
