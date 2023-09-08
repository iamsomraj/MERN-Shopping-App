import { IProduct } from '@/types';

interface QuantityChipsProps {
  product: IProduct;
}

const QuantityChips = (props: QuantityChipsProps) => {
  const chips = [];
  if (props.product.qtyInStock > 1) {
    chips.push(
      <button
        key={'1-qty'}
        className='h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-zinc-50 dark:bg-zinc-800 border-2 transition-all duration-300'>
        1
      </button>
    );
  }
  if (props.product.qtyInStock > 5) {
    chips.push(
      <button
        key={'5-qty'}
        className='h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-zinc-50 dark:bg-zinc-800 border-2 transition-all duration-300'>
        5
      </button>
    );
  }
  if (props.product.qtyInStock > 10) {
    chips.push(
      <button
        key={'10-qty'}
        className='h-10 w-10 flex-shrink-0 rounded-full flex justify-center items-center bg-zinc-50 dark:bg-zinc-800 border-2 transition-all duration-300'>
        10
      </button>
    );
  }
  return <div className='flex flex-wrap justify-start items-center gap-3 text-sm font-bold'>{chips}</div>;
};

export default QuantityChips;
