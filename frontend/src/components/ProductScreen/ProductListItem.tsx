import { IProduct } from '@/types';

type Props = {
  product: IProduct;
};

const ProductListItem = ({ product }: Props) => {
  return (
    <div className='group bg-zinc-50 md:flex rounded-xl border overflow-hidden'>
      <div className='bg-zinc-100 dark:bg-zinc-300 duration-300 transition-all p-6 flex justify-center items-center'>
        <img
          className='h-60 w-60 object-cover mix-blend-multiply object-center group-hover:scale-110 transition-all duration-300'
          src={product.image}
        />
      </div>
      <div className='p-6 flex flex-col md:flex-1 bg-zinc-50 dark:bg-zinc-800 gap-6 md:group-hover:px-9 transition-all duration-300'>
        <h3 className='text-4xl font-medium text-zinc-900 dark:text-zinc-50 group-hover:underline'>{product.name}</h3>
        <div className='text-2xl font-medium text-zinc-500'>Price</div>
        <div className='flex gap-6 items-center'>
          <h3 className='text-xl line-through font-medium text-red-500'>${(product.price * 1.5).toFixed(2)}</h3>
          <h3 className='text-6xl font-thin text-zinc-500'>${product.price}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
