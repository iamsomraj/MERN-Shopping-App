import Button from '@/components/UI/Button';
import { IOrder } from '@/types';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';

interface IOrderItemProps {
  order: IOrder;
  goToPayment: (order: IOrder) => void;
}

const OrderItem = ({ order, goToPayment }: IOrderItemProps) => {
  return (
    <>
      {/* BEGIN - ORDER ITEM CARD */}
      <article
        key={order._id}
        className='rounded-xl bg-zinc-50 dark:bg-zinc-800 overflow-hidden border drop-shadow'>
        {/* BEGIN - ORDER HEADER */}
        <div className={`p-6  ${order.isPaymentDone ? 'bg-green-100 dark:bg-zinc-700 text-green-700 dark:text-green-300' : 'bg-zinc-200 dark:bg-zinc-700'} text-3xl font-medium flex justify-start items-center gap-6`}>
          <span>Order Overview</span>
          {order.isPaymentDone && <CheckBadgeIcon className='h-5 w-5 flex-shrink-0' />}
        </div>
        {/* END - ORDER HEADER */}

        {/* BEGIN - ORDER BODY */}
        <div className='p-6 flex flex-col gap-3'>
          <p className='opacity-50 text-xs'>Order #{order._id}</p>
          <p className='font-medium text-lg'>Total Items - {order.products.length}</p>
          <p className='text-2xl font-medium'>$ {order.totalPrice.toFixed(2)}</p>
          <div className='grid grid-cols-5 gap-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400'>
            {order.products.map((prod, index) => (
              <div
                key={prod._id}
                className='col-span-5 grid grid-cols-5'>
                <span className='col-span-5 md:col-span-1'>Product {index + 1}</span>
                <span className='col-span-5 md:col-span-1'>{prod.name}</span>
                <span className='col-span-5 md:col-span-1'>{prod.qty}</span>
                <span className='col-span-5 md:col-span-1'>{prod.price}</span>
                <span className='col-span-5 md:col-span-1'>{(prod.qty * prod.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        {/* END - ORDER BODY */}

        {!order.isPaymentDone ? (
          <>
            {/* BEGIN - ORDER PAYMENT BUTTON */}
            <div className='px-6 pb-6'>
              <Button onClick={() => goToPayment(order)}>Proceed To Payment</Button>
            </div>
            {/* END - ORDER PAYMENT BUTTON */}
          </>
        ) : (
          <>
            {/* BEGIN - PAYMENT SUCCESS */}
            <div className='px-6 py-6 border-t'>
              <div className='text-sm capitalize font-medium'>Payment Successful</div>
              <span className='text-xs opacity-50'>
                {order.user.name} - {order.user.email}
              </span>
            </div>
            {/* END - PAYMENT SUCCESS */}
          </>
        )}
      </article>
      {/* END - ORDER ITEM CARD */}
    </>
  );
};

export default OrderItem;
