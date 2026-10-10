import { EmptyState } from '@/components/common/EmptyState';
import { PageHeader } from '@/components/common/PageHeader';
import { CartLineItem } from '@/components/layout/CartLineItem';
import { FreeShippingProgress } from '@/components/layout/FreeShippingProgress';
import { OrderSummary } from '@/components/order/OrderSummary';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { Button } from '@/components/ui/button';
import { useCartValidation } from '@/hooks/use-cart-validation';
import { usePageMeta } from '@/hooks/use-page-meta';
import { priceCart } from '@/lib/pricing';
import { useCartCount, useCartStore } from '@/stores/cart';
import { ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

export default function CartPage() {
  usePageMeta('Cart', { noindex: true });
  useCartValidation();
  const { items, clear } = useCartStore();
  const count = useCartCount();
  const totals = priceCart(items);

  return (
    <div className='space-y-16 pb-8'>
      <div className='container space-y-8 py-8'>
        <PageHeader
          title='Shopping cart'
          description={count ? `${count} item${count === 1 ? '' : 's'} in your cart` : undefined}
          actions={
            items.length > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clear}>
                Clear cart
              </Button>
            )
          }
        />
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title='Your cart is empty'
            description='Browse the shop and add something you love.'
            action={
              <Button asChild>
                <Link to='/shop'>Start shopping</Link>
              </Button>
            }
          />
        ) : (
          <div className='grid gap-8 lg:grid-cols-[1fr_22rem]'>
            <div className='space-y-6'>
              <FreeShippingProgress subtotal={totals.itemsPrice} />
              <ul className='divide-y rounded-xl border'>
                {items.map((item) => (
                  <li
                    key={item._id}
                    className='p-4'>
                    <CartLineItem item={item} />
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant='link'
                className='px-0'>
                <Link to='/shop'>← Continue shopping</Link>
              </Button>
            </div>
            <OrderSummary
              {...totals}
              itemCount={count}
              className='h-fit lg:sticky lg:top-24'>
              <Button
                asChild
                size='lg'
                className='w-full'>
                <Link to='/checkout'>
                  Checkout <ArrowRight />
                </Link>
              </Button>
              <p className='flex items-center justify-center gap-1.5 text-xs text-muted-foreground'>
                <Lock className='size-3' /> Secure checkout with PayPal
              </p>
            </OrderSummary>
          </div>
        )}
      </div>
      <RecentlyViewed />
    </div>
  );
}
