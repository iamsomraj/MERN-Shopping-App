import { createOrder } from '@/api/order';
import Button from '@/components/UI/Button';
import ProductRowItem from '@/components/UI/ProductRowItem';
import { getErrorMessage } from '@/config';
import { selectUser } from '@/features/auth/authSlice';
import { clearCart, closeDrawer, openDrawer, removeFromCart, selectCart, selectShowDrawer } from '@/features/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { ICartProduct } from '@/types';
import { ForwardIcon, LockClosedIcon, TrashIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const showDrawer = useAppSelector(selectShowDrawer);
  const cart = useAppSelector(selectCart);

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

  const total = useMemo(() => {
    if (cart.length === 0) {
      return 0;
    }
    const sum = cart.reduce((acc, curr) => {
      return acc + curr.price * (curr.qty || 1);
    }, 0);
    return sum.toFixed(2);
  }, [cart]);

  const { mutate: placeOrder, isLoading } = useMutation({
    mutationFn: async () => {
      return await createOrder(cart);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while we were trying to place your order!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      deleteCartItems();
      onToggle();
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      navigate('/orders');
      toast.success('Order placed successfully!');
    },
  });

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

  const deleteSingleItem = (product: ICartProduct) => {
    dispatch(
      removeFromCart({
        product,
      })
    );
  };

  const navigateToProductPage = (product: ICartProduct) => {
    navigate(`/products/${product._id}`);
    onToggle();
  };

  const drawerContent = (
    <>
      {/* BEGIN - DRAWER OVERLAY */}
      {showDrawer && (
        <div
          onClick={onToggle}
          className='fixed inset-0 bg-zinc-900/50 z-10'></div>
      )}
      {/* END - DRAWER OVERLAY */}

      {/* BEGIN - CART CONTAINER */}
      <div className={`fixed z-20 flex flex-col min-h-screen max-h-screen w-full inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-1/2 md:rounded-l-lg bg-zinc-100 dark:bg-zinc-800 transition-all duration-300 drop-shadow-xl transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* BEGIN - CART UPPER HEADER */}
        <div className='flex justify-between items-center px-6 py-3 border-b border-b-zinc-200 dark:border-b-zinc-700 drop-shadow-lg'>
          {/* BEGIN - HEADING */}
          <h3 className='text-2xl text-zinc-900 dark:text-zinc-100 font-medium'>
            Cart Items
            {cart.length > 0 && <span className='ml-3'>({cart.length})</span>}
          </h3>
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
        {/* END - CART UPPER HEADER */}

        {/* BEGIN - CART LOWER HEADER */}
        <div className='flex justify-between items-center px-6 py-3 border-t border-t-zinc-200 dark:border-t-zinc-700 drop-shadow-lg'>
          {cart.length > 0 ? (
            <>
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
            </>
          ) : (
            <span className='text-base text-zinc-900 font-bold dark:text-zinc-50 duration-300 transition-all'>No Items In Cart</span>
          )}

          <div className='flex justify-end items-center gap-3 md:gap-6'>
            {/* BEGIN - TOTAL PRICE */}
            {cart.length > 0 && <span className='text-base md:text-2xl font-medium dark:text-zinc-100'>$ {total}</span>}
            {/* END - TOTAL PRICE */}

            {/* BEGIN - PLACE ORDER BUTTON */}
            <Button
              disabled={user === null || cart.length === 0}
              onClick={() => placeOrder()}
              loading={isLoading}>
              <div className='flex justify-center items-center gap-3'>
                {user !== null ? <ForwardIcon className='h-5 w-5 flex-shrink-0' /> : <LockClosedIcon className='h-5 w-5 flex-shrink-0' />}
                <span>Place Order</span>
              </div>
            </Button>
            {/* END - PLACE ORDER BUTTON */}
          </div>
        </div>
        {/* END - CART LOWER HEADE=R */}

        {/* BEGIN - CART BODY */}
        <div className='flex-1 overflow-y-auto'>
          {cart.map((product) => (
            <ProductRowItem
              key={product._id}
              product={product}
              deleteSingleItem={deleteSingleItem}
              redirectToProduct={navigateToProductPage}
            />
          ))}
        </div>
        {/* END - CART BODY  */}
      </div>
      {/* END - CART CONTAINER */}
    </>
  );

  return drawerContent;
};

export default CartDrawer;
