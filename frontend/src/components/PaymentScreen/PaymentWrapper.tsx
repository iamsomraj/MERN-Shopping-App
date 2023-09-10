import { fetchOrderDetail, updateOrder } from '@/api/order';
import { getPaypalConfig } from '@/api/payment';
import PaymentOrderItem from '@/components/PaymentScreen/PaymentOrderItem';
import PaypalProvider from '@/components/PaymentScreen/PaypalProvider';
import { getErrorMessage } from '@/config';
import { ArrowPathIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const PayementWrapper = () => {
  const queryClient = useQueryClient();
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
    onSuccess: async () => {
      await new Promise((res) => setTimeout(res, 2000));
      toast.success('Yayy! Your payment is successful!');
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      navigate('/orders');
    },
  });

  const onPaymentSuccess = async () => {
    setOrderDetail();
  };

  const onPaymentError = async () => {
    queryClient.invalidateQueries({ queryKey: ['user-orders'] });
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
      <PaypalProvider
        paypalClientId={paypalClientId}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    );

  const orderContent = <PaymentOrderItem order={order} />;

  const content = (
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

  return content;
};

export default PayementWrapper;
