import { getUserOrders } from '@/api/order';
import { getErrorMessage } from '@/config';
import { IOrder } from '@/types';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';

const OrderWrapper = () => {
  const navigate = useNavigate();
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      return await getUserOrders();
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching orders!');
      toast.error(errorMessage);
    },
  });

  const goToPayment = (order: IOrder) => {
    navigate(`/payment/${order._id}`);
  };

  if (isLoading) {
    return 'Loading...';
  }

  if (error) {
    return 'Error occurred while fetching few details';
  }

  const orderContent: JSX.Element[] = [];

  if (orders && orders.length > 0) {
    orders.forEach((order) => {
      orderContent.push(
        <article
          key={order._id}
          className='rounded-xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden border drop-shadow'>
          <div className={`p-6  ${order.isPaymentDone ? 'bg-green-100 dark:bg-zinc-700 text-green-700 dark:text-green-300' : 'bg-zinc-200 dark:bg-zinc-700'} text-3xl font-medium flex justify-start items-center gap-6`}>
            <span>Order Overview</span>
            {order.isPaymentDone && <CheckBadgeIcon className='h-5 w-5 flex-shrink-0' />}
          </div>
          <div className='p-6 flex flex-col gap-3'>
            <p className='font-medium text-lg'>Total Items - {order.products.length}</p>
            <p className='text-2xl font-medium'>$ {order.totalPrice.toFixed(2)}</p>
            <div className='grid grid-cols-5 gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400'>
              {order.products.map((prod, index) => (
                <>
                  <span className='col-span-5 md:col-span-1'>Product {index + 1}</span>
                  <span className='col-span-5 md:col-span-1'>{prod.name}</span>
                  <span className='col-span-5 md:col-span-1'>{prod.qty}</span>
                  <span className='col-span-5 md:col-span-1'>{prod.price}</span>
                  <span className='col-span-5 md:col-span-1'>{(prod.qty * prod.price).toFixed(2)}</span>
                </>
              ))}
            </div>
          </div>
          {!order.isPaymentDone && (
            <div className='px-6 pb-6'>
              <Button onClick={() => goToPayment(order)}>Proceed To Payment</Button>
            </div>
          )}
        </article>
      );
    });
  }

  return <div className='flex flex-col gap-12'>{orderContent}</div>;
};

export default OrderWrapper;
