import { getUserOrders } from '@/api/order';
import OrderItem from '@/components/OrderScreen/OrderItem';
import { getErrorMessage } from '@/config';
import { IOrder } from '@/types';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const OrderWrapper = () => {
  const navigate = useNavigate();
  const {
    data: orders,
    isPending,
    error,
  } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      return await getUserOrders();
    },
  });

  // Handle errors in useEffect for TanStack Query v5
  useEffect(() => {
    if (error) {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching orders!');
      toast.error(errorMessage);
    }
  }, [error]);

  const goToPayment = (order: IOrder) => {
    navigate(`/payment/${order._id}`);
  };

  if (isPending) {
    return 'Loading...';
  }

  if (!orders || error) {
    return 'Error occurred while fetching few details';
  }

  const orderListContent = (
    <div className='flex flex-col gap-12'>
      {orders.map((order) => (
        <OrderItem
          key={order._id}
          order={order}
          goToPayment={goToPayment}
        />
      ))}
    </div>
  );

  return orderListContent;
};

export default OrderWrapper;
