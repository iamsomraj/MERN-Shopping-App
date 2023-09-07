import { IProduct } from '@/types';
import Button from '../UI/Button';
import { ArrowTrendingUpIcon, ExclamationTriangleIcon, ShoppingCartIcon } from '@heroicons/react/20/solid';
import QuantityChips from './QuantityChips';

type Props = {
  product: IProduct;
};

const Product = ({ product }: Props) => {
  return (
    <>
      {/* BEGIN - PRODUCT */}
      <div className='flex flex-col md:flex-row gap-12'>
        {/* BEGIN - PRODUCT IMAGE */}
        <div className='p-12 bg-zinc-100 dark:bg-zinc-300 transition-all duration-300 rounded-lg drop-shadow'>
          <img
            className='h-60 w-60 rounded-xl mix-blend-multiply object-cover object-center transition-all duration-300'
            src={product.image}
          />
        </div>
        {/* END - PRODUCT IMAGE */}

        {/* BEGIN - PRODUCT INFO */}
        <div className='flex flex-col gap-6'>
          <h3 className='text-3xl font-medium text-zinc-900 dark:text-zinc-50 group-hover:underline'>{product.name}</h3>
          <div className='text-xl font-extralight flex justify-start items-center gap-6 flex-wrap'>
            {product.isAvailable ? (
              <span className='flex justify-start items-center gap-3 text-green-400'>
                <ArrowTrendingUpIcon className='h-5 w-5 flex-shrink-0' />
                Trending
              </span>
            ) : (
              <span className='flex justify-start items-center gap-3 text-red-400'>
                <ExclamationTriangleIcon className='h-5 w-5 flex-shrink-0' />
                Sold Out
              </span>
            )}
          </div>
          <div className='flex justify-start items-center gap-3'>
            <h3 className='text-xl line-through font-medium text-red-500'>${(product.price * 1.5).toFixed(2)}</h3>
            <h3 className='text-6xl font-thin text-zinc-500'>${product.price}</h3>
          </div>
          <QuantityChips />
          <Button>
            <div className='flex justify-center items-center gap-3'>
              <ShoppingCartIcon className='h-5 w-5 flex-shrink-0' />
              <span>Add To Cart</span>
            </div>
          </Button>
        </div>
        {/* END - PRODUCT INFO */}
      </div>
      {/* END - PRODUCT */}
    </>
  );
};

export default Product;
