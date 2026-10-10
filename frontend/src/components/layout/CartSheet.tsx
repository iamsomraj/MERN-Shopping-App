import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { priceCart } from '@/lib/pricing';
import { formatPrice } from '@/lib/utils';
import { useCartCount, useCartStore } from '@/stores/cart';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { CartLineItem } from './CartLineItem';
import { FreeShippingProgress } from './FreeShippingProgress';

export function CartButton() {
  const setOpen = useCartStore((state) => state.setOpen);
  const count = useCartCount();
  return (
    <Button
      variant='ghost'
      size='icon'
      className='relative'
      onClick={() => setOpen(true)}
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
      <ShoppingBag />
      {count > 0 && (
        <Badge className='absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 rounded-full px-1 text-[10px] tabular-nums'>
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </Button>
  );
}

export function CartSheet() {
  const { items, isOpen, setOpen } = useCartStore();
  const count = useCartCount();
  const { itemsPrice } = priceCart(items);
  const close = () => setOpen(false);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={setOpen}>
      <SheetContent className='flex w-full flex-col gap-0 sm:max-w-md'>
        <SheetHeader className='border-b'>
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            {count === 0 ? 'Your cart is empty.' : `${count} item${count === 1 ? '' : 's'}`}
          </SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center'>
            <div className='flex size-14 items-center justify-center rounded-full bg-muted'>
              <ShoppingBag className='size-6 text-muted-foreground' />
            </div>
            <p className='text-sm text-muted-foreground'>Looks like you haven&apos;t added anything yet.</p>
            <Button
              asChild
              onClick={close}>
              <Link to='/shop'>Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className='flex-1 space-y-5 overflow-y-auto p-4'>
              <FreeShippingProgress subtotal={itemsPrice} />
              {items.map((item) => (
                <CartLineItem
                  key={item._id}
                  item={item}
                  onNavigate={close}
                />
              ))}
            </div>
            <SheetFooter className='border-t'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span className='text-base font-semibold tabular-nums'>{formatPrice(itemsPrice)}</span>
              </div>
              <p className='text-xs text-muted-foreground'>Shipping calculated at checkout.</p>
              <Separator className='my-1' />
              <Button
                asChild
                size='lg'
                onClick={close}>
                <Link to='/checkout'>Checkout</Link>
              </Button>
              <Button
                asChild
                variant='outline'
                onClick={close}>
                <Link to='/cart'>View cart</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
