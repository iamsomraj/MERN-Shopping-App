import Button from '@/components/UI/Button';
import { closeDrawer, openDrawer, selectShowDrawer } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { XMarkIcon } from '@heroicons/react/20/solid';
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

  const drawerContent = (
    <>
      {/* BEGIN - CONTENT CONTAINER */}
      <div
        className={`fixed z-20 min-h-screen max-h-screen w-full inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-1/2 md:rounded-l-lg bg-zinc-100 dark:bg-zinc-800 flex justify-center items-center transition-all duration-300 drop-shadow-xl transform ${
          showDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}>
        {/* BEGIN - CLOSE BUTTON */}
        <div className='absolute top-5 right-5'>
          <Button onClick={onToggle}>
            <div className='flex justify-center items-center gap-3'>
              <XMarkIcon className='h-5 w-5 flex-shrink-0' />
              <span className='hidden md:block'>Close</span>
            </div>
          </Button>
        </div>
        {/* END - CLOSE BUTTON */}
      </div>
      {/* END - CONTENT CONTAINER */}
    </>
  );

  return drawerContent;
};

export default CartDrawer;
