import { closeDrawer, openDrawer, selectShowDrawer } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
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
    <div className={`fixed z-20 min-h-screen max-h-screen w-full inset-0  md:inset-y-0 md:left-auto md:right-0 md:w-1/2 bg-white flex justify-center items-center transition-all duration-300 transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
      <button onClick={onToggle}>{showDrawer ? 'close' : 'open'}</button>
    </div>
  );

  return drawerContent;
};

export default CartDrawer;
