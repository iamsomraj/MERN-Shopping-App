import { IOrder } from '@/types';

interface OrderRevenueCardProps {
  orders: IOrder[];
}

const OrderRevenueCard = ({ orders }: OrderRevenueCardProps) => {
  if (orders.length === 0) return null;

  return (
    <div className='p-6 rounded-xl border dark:border-zinc-500/50 flex flex-col gap-3'>
      <p className='text-4xl font-medium'>Total Orders</p>
      <div className='text-3xl font-light text-zinc-400 tracking-wider'>{orders.length}</div>
      <p className='text-4xl font-medium'>Total Order Revenue</p>
      <div className='text-3xl font-light text-zinc-400 tracking-wider'>$ {orders.reduce((acc, order) => acc + order.totalPrice, 0).toFixed(2)}</div>
    </div>
  );
};

export default OrderRevenueCard;
