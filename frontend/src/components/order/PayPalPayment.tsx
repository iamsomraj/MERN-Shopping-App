import { orderKeys, type PaymentConfig, type PayPalCapture, usePayOrder } from '@/api/orders';
import { getErrorMessage } from '@/lib/api';
import type { IOrder } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

function Buttons({ order, serverCapture }: { order: IOrder; serverCapture: boolean }) {
  const [{ isPending, isRejected }] = usePayPalScriptReducer();
  const { mutateAsync: payOrder } = usePayOrder(order._id);
  const queryClient = useQueryClient();

  if (isRejected) {
    return (
      <p className='rounded-lg bg-muted p-3 text-sm text-muted-foreground'>
        PayPal could not be loaded. Check your connection or disable content blockers, then reload.
      </p>
    );
  }

  return (
    <>
      {isPending && <Skeleton className='h-24 w-full' />}
      <PayPalButtons
        style={{ layout: 'vertical', shape: 'pill', label: 'pay' }}
        forceReRender={[order.totalPrice]}
        createOrder={(_data, actions) =>
          actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                reference_id: order._id,
                amount: { currency_code: 'USD', value: order.totalPrice.toFixed(2) },
              },
            ],
          })
        }
        onApprove={async (data, actions) => {
          try {
            if (serverCapture) {
              // The API re-checks the order and stock, then captures — no money moves if it refuses.
              await payOrder({ id: data.orderID });
            } else {
              const capture = (await actions.order?.capture()) as PayPalCapture | undefined;
              if (!capture) throw new Error('Payment could not be captured');
              await payOrder(capture);
            }
            toast.success('Payment received — thank you for your order!');
          } catch (error) {
            toast.error(getErrorMessage(error, 'We could not confirm your payment.'));
            void queryClient.invalidateQueries({ queryKey: orderKeys.detail(order._id) });
          }
        }}
        onCancel={() => toast('Payment cancelled. You can pay any time from this page.')}
        onError={() => toast.error('PayPal ran into a problem. Please try again.')}
      />
    </>
  );
}

/** Loaded lazily: the PayPal SDK only ships to users with an unpaid order open. */
export default function PayPalPayment({ order, config }: { order: IOrder; config: PaymentConfig }) {
  return (
    <PayPalScriptProvider options={{ clientId: config.paypalClientId, currency: 'USD', intent: 'capture' }}>
      <Buttons
        order={order}
        serverCapture={config.serverCapture}
      />
    </PayPalScriptProvider>
  );
}
