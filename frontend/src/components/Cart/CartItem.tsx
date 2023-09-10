import Button from '@/components/UI/Button';
import { ICartProduct } from '@/types';
import { TrashIcon } from '@heroicons/react/20/solid';

interface CartItemProps {
  product: ICartProduct;
  deleteSingleItem: (product: ICartProduct) => void;
  redirectToProduct: (product: ICartProduct) => void;
}

const CartItem = ({ product, deleteSingleItem, redirectToProduct }: CartItemProps) => {
  return (
    <>
      {/* BEGIN - CART ITEM */}
      <div
        key={product._id}
        className='flex justify-between w-full transition-all duration-300 bg-zinc-50 dark:bg-zinc-700 items-center gap-6 px-12 py-6 border-b dark:border-b-zinc-500/50'>
        {/* BEGIN - IMAGE, NAME, PRICE */}
        <div className='flex flex-col md:flex-row justify-start md:items-center gap-6'>
          <div className='bg-zinc-100 w-fit dark:bg-zinc-300 p-3 rounded-lg drop-shadow'>
            <img
              className='h-24 w-24 rounded-lg mix-blend-multiply object-cover object-center overflow-hidden flex-shrink-0'
              src={product.image}
            />
          </div>
          <div className='flex flex-col gap-3 dark:text-zinc-200'>
            <p
              onClick={() => redirectToProduct(product)}
              className='text-2xl font-medium line-clamp-2 hover:underline hover:cursor-pointer'>
              {product.name}
            </p>
            <p>$ {product.price}</p>
            <p className='text-lg font-bold text-zinc-900'>
              {product.qty} {product.qty > 1 ? 'Quantities' : 'Quantity'}
            </p>
          </div>
        </div>
        {/* END - IMAGE, NAME, PRICE */}

        {/* BEGIN - DELETE ITEM */}
        <Button onClick={() => deleteSingleItem(product)}>
          <TrashIcon className='h-5 w-5 flex-shrink-0' />
        </Button>
        {/* END - DELETE ITEM */}
      </div>
      {/* END - CART ITEM */}
    </>
  );
};

export default CartItem;
