import Button from '@/components/UI/Button';
import { clearCart, closeDrawer, openDrawer, selectShowDrawer } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { ForwardIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect } from 'react';

const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const showDrawer = useAppSelector(selectShowDrawer);

  useEffect(() => {
    if (showDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showDrawer]);

  const onToggle = () => {
    if (showDrawer) {
      dispatch(closeDrawer());
    } else {
      dispatch(openDrawer());
    }
  };

  const deleteCartItems = () => {
    dispatch(clearCart());
  };

  const drawerContent = (
    <>
      {/* BEGIN - CART CONTAINER */}
      <div className={`fixed z-20 min-h-screen max-h-screen w-full inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-1/2 md:rounded-l-lg bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 drop-shadow-xl transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col h-full w-full '>
          {/* BEGIN - CART HEADER  */}
          <div className='flex justify-between items-center px-6 py-3 border-b border-b-zinc-200 dark:border-b-zinc-700 drop-shadow-lg'>
            {/* BEGIN - HEADING */}
            <h3 className='text-2xl text-zinc-900 dark:text-zinc-100 font-medium'>Cart Items</h3>
            {/* END - HEADING */}

            {/* BEGIN - CLOSE BUTTON */}
            <Button onClick={onToggle}>
              <div className='flex justify-center items-center gap-3'>
                <XMarkIcon className='h-5 w-5 flex-shrink-0' />
                <span className='hidden md:block'>Close</span>
              </div>
            </Button>
            {/* END - CLOSE BUTTON */}
          </div>
          {/* END - CART HEADER  */}

          {/* BEGIN - CART BODY  */}
          <div className='flex-1'></div>
          {/* END - CART BODY  */}

          {/* BEGIN - CART FOOTER  */}
          <div className='flex justify-between items-center px-6 py-3 border-t border-t-zinc-200 dark:border-t-zinc-700 drop-shadow-lg'>
            {/* BEGIN - CLEAR CART BUTTON */}
            <Button
              variant='transparent'
              onClick={deleteCartItems}>
              <div className='flex justify-center items-center gap-3'>
                <TrashIcon className='h-5 w-5 flex-shrink-0' />
                <span className='hidden md:block'>Clear Cart</span>
              </div>
            </Button>
            {/* END - CLEAR CART BUTTON */}

            {/* BEGIN - PLACE ORDER BUTTON */}
            <Button onClick={onToggle}>
              <div className='flex justify-center items-center gap-3'>
                <ForwardIcon className='h-5 w-5 flex-shrink-0' />
                <span>Place Order</span>
              </div>
            </Button>
            {/* END - PLACE ORDER BUTTON */}
          </div>
          {/* END - CART FOOTER  */}
        </div>
      </div>
      {/* END - CART CONTAINER */}
    </>
  );

  return drawerContent;
};

export default CartDrawer;
