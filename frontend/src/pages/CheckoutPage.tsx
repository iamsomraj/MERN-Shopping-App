import { useCreateOrder } from '@/api/orders';
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { AddressBlock } from '@/components/order/AddressBlock';
import { OrderSummary } from '@/components/order/OrderSummary';
import { ProductImage } from '@/components/product/ProductImage';
import { Button } from '@/components/ui/button';
import { useCartValidation } from '@/hooks/use-cart-validation';
import { usePageMeta } from '@/hooks/use-page-meta';
import { getErrorMessage } from '@/lib/api';
import { priceCart } from '@/lib/pricing';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useCartCount, useCartStore } from '@/stores/cart';
import { useCheckoutStore } from '@/stores/checkout';
import { Loader2, Lock, MapPin, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function CheckoutPage() {
  usePageMeta('Checkout', { noindex: true });
  const { isValidating } = useCartValidation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { items, clear } = useCartStore();
  const count = useCartCount();
  const { shippingAddress, setShippingAddress } = useCheckoutStore();
  const [step, setStep] = useState(shippingAddress ? 1 : 0);
  const { mutate: createOrder, isPending, isSuccess } = useCreateOrder();
  const totals = priceCart(items);

  // After placing, the cart empties before navigation; don't bounce back to /cart.
  if (items.length === 0 && !isPending && !isSuccess) {
    return (
      <Navigate
        to='/cart'
        replace
      />
    );
  }

  const placeOrder = () => {
    if (!shippingAddress) return;
    createOrder(
      { products: items.map((item) => ({ product: item._id, qty: item.qty })), shippingAddress },
      {
        onSuccess: (order) => {
          clear();
          toast.success('Order placed! Complete your payment to confirm it.');
          navigate(`/orders/${order._id}`, { replace: true });
        },
        onError: (error) => toast.error(getErrorMessage(error, 'We could not place your order.')),
      }
    );
  };

  return (
    <div className='container space-y-8 py-8'>
      <div className='space-y-4'>
        <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Checkout</h1>
        <CheckoutSteps current={step} />
      </div>
      <div className='grid gap-8 lg:grid-cols-[1fr_22rem]'>
        <div className='space-y-6'>
          {step === 0 ? (
            <section className='rounded-xl border p-6'>
              <h2 className='mb-6 flex items-center gap-2 font-semibold'>
                <MapPin className='size-4 text-primary' /> Shipping address
              </h2>
              <ShippingForm
                defaultValues={shippingAddress ?? { fullName: user?.name ?? '' }}
                onSubmit={(address) => {
                  setShippingAddress(address);
                  setStep(1);
                }}
              />
            </section>
          ) : (
            <>
              <section className='rounded-xl border p-6'>
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='flex items-center gap-2 font-semibold'>
                      <MapPin className='size-4 text-primary' /> Shipping to
                    </h2>
                    {shippingAddress && (
                      <AddressBlock
                        address={shippingAddress}
                        className='mt-2'
                      />
                    )}
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setStep(0)}>
                    <Pencil /> Edit
                  </Button>
                </div>
              </section>
              <section className='rounded-xl border'>
                <h2 className='border-b p-4 font-semibold'>Items ({count})</h2>
                <ul className='divide-y'>
                  {items.map((item) => (
                    <li
                      key={item._id}
                      className='flex items-center gap-4 p-4'>
                      <ProductImage
                        src={item.image}
                        alt=''
                        tileClassName='w-14 shrink-0 rounded-md border'
                        className='p-1.5'
                      />
                      <div className='min-w-0 flex-1'>
                        <p className='truncate text-sm font-medium'>{item.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {item.qty} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className='text-sm font-medium tabular-nums'>{formatPrice(item.qty * item.price)}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
        <OrderSummary
          {...totals}
          itemCount={count}
          className='h-fit lg:sticky lg:top-24'>
          <Button
            size='lg'
            className='w-full'
            disabled={step !== 1 || isPending || isValidating}
            onClick={placeOrder}>
            {isPending ? <Loader2 className='animate-spin' /> : <Lock />}
            Place order
          </Button>
          <p className='text-center text-xs text-muted-foreground'>
            You&apos;ll pay securely with PayPal on the next step.
          </p>
        </OrderSummary>
      </div>
    </div>
  );
}
