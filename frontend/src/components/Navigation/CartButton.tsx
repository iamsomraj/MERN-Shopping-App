import Button from '@/components/UI/Button';
import { IProduct } from '@/types';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';

interface ICartButtonProps {
  openCart: () => void;
  cart: IProduct[];
}

const CartButton = ({ openCart, cart }: ICartButtonProps) => {
  return (
    <Button onClick={openCart}>
      <div className='flex justify-center items-center gap-1'>
        <ShoppingCartIcon className='h-5 w-5 flex-shrink-0' />
        <span className='hidden md:block'>Cart</span>
        {cart.length > 0 && <span className='text-xs md:text-sm'>({cart.length})</span>}
      </div>
    </Button>
  );
};

export default CartButton;
