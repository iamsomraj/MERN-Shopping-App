import { fetchOrderDetail, updateOrder } from '@/api/order';
import { getPaypalConfig } from '@/api/payment';
import { getErrorMessage } from '@/config';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const PayementWrapper = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();

  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useQuery({
    queryKey: [`user-orders-${orderId}`],
    queryFn: async () => {
      if (!orderId) {
        return;
      }
      return await fetchOrderDetail(orderId);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching order details!');
      toast.error(errorMessage);
    },
  });

  const {
    data: paypalClientId,
    isLoading: isPaypalConfigLoading,
    error: paypalConfigError,
  } = useQuery({
    queryKey: [`paypal-config`],
    queryFn: async () => {
      if (!orderId) {
        return;
      }
      return await getPaypalConfig();
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching payment configuration!');
      toast.error(errorMessage);
    },
  });

  const { isLoading: isPaymentInProgress, mutate: setOrderDetail } = useMutation({
    mutationFn: async () => {
      if (!orderId) {
        return;
      }
      return await updateOrder(orderId);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while we were making your payment!');
      toast.error(errorMessage);
    },
    onSuccess: () => {
      toast.success('Yayy! Your payment is successful!');
      navigate('/orders');
    },
  });

  const onPaymentSuccess = async () => {
    setOrderDetail();
  };

  const onPaymentError = async () => {
    navigate('/orders');
    toast.error('Error occurred while we were making your payment!');
  };

  if (isOrderLoading) {
    return 'Loading...';
  }

  if (orderError) {
    return <Navigate to={'/orders'} />;
  }

  if ((orderId || '').trim().length === 0 || !order || order.isPaymentDone) {
    return <Navigate to={'/orders'} />;
  }

  const loadingContent = (
    <div className='my-12 mx-auto'>
      <ArrowPathIcon className='h-5 w-5 flex-shrink-0 animate-spin' />
    </div>
  );

  const paypalContent =
    isPaypalConfigLoading || paypalConfigError || !paypalClientId ? (
      loadingContent
    ) : (
      <div className='w-fit z-0'>
        <PayPalScriptProvider options={{ clientId: paypalClientId }}>
          <PayPalButtons
            style={{ shape: 'pill' }}
            onApprove={onPaymentSuccess}
            onCancel={onPaymentError}
            onError={onPaymentError}
          />
        </PayPalScriptProvider>
      </div>
    );

  const orderContent = (
    <article
      key={order._id}
      className='rounded-lg flex flex-col gap-3 w-full'>
      <h1 className='text-3xl font-semibold'>
        Order <span className='text-sm italic opacity-50 font-medium'>#{order._id}</span>
      </h1>
      <div className='flex flex-col gap-3'>
        <h3 className='text-lg font-semibold dark'>Items Overview</h3>
        <ul className=''>
          {order.products.map((prod) => (
            <li
              key={prod._id}
              className='flex flex-wrap justify-between items-center py-2 gap-6 border-b-2 border-b-zinc-500/10'>
              <h4 className='text-base font-medium'>{prod.name}</h4>
              <div className='flex items-center gap-3'>
                <p className='text-xs font-medium'>${prod.price.toFixed(2)}</p>
                <span>x</span>
                <p className='text-xs font-medium'>{prod.qty}</p>
                <span>=</span>
                <p className='text-xs font-medium'>${(prod.qty * prod.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className='text-lg font-semibold'>Total Price</p>
        <p className='opacity-50 font-medium'>${order.totalPrice.toFixed(2)}</p>
        <p className='text-lg font-semibold'>Payment Status</p>
        <p className='opacity-50 font-medium'>{order.isPaymentDone ? 'Paid' : 'Pending'}</p>
      </div>
      <hr className='border-b' />
      <div>
        <h3 className='text-lg font-semibold'>User Information</h3>
        <div className='flex gap-3 text-sm'>
          <p className='font-medium opacity-50'>{order.user.name}</p>
          <span>-</span>
          <p className='font-medium opacity-50'>{order.user.email}</p>
        </div>
      </div>
    </article>
  );

  return (
    <div className='flex flex-col gap-12'>
      {isPaymentInProgress ? (
        loadingContent
      ) : (
        <div className='flex flex-col gap-12 md:flex-row items-start md:justify-between'>
          {orderContent}
          {paypalContent}
        </div>
      )}
    </div>
  );
};

export default PayementWrapper;
