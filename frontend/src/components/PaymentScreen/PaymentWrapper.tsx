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
      <div className='mx-auto max-w-xs'>
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
      className='rounded-xl w-full bg-zinc-50 dark:bg-zinc-800 overflow-hidden border drop-shadow'>
      <div className='p-6 bg-zinc-200 dark:bg-zinc-700 text-3xl font-medium'>Payment Details</div>
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
    </article>
  );

  return (
    <div className='flex flex-col gap-12'>
      {isPaymentInProgress ? (
        loadingContent
      ) : (
        <div className='flex flex-col gap-12 md:flex-row items-start'>
          {orderContent}
          {paypalContent}
        </div>
      )}
    </div>
  );
};

export default PayementWrapper;
