import { IOrder } from '@/types';

interface PaymentOrderProps {
  order: IOrder;
}

const PaymentOrder = ({ order }: PaymentOrderProps) => {
  return (
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
};

export default PaymentOrder;
