import { IProduct } from '@/types';

type Props = {
  product: IProduct;
};

const ProductCarouselItem = ({ product }: Props) => {
  return (
    <div className='flex flex-col gap-9 items-center'>
      <div className='bg-zinc-50 dark:bg-zinc-300 transition-all duration-300 p-6 w-fit flex justify-center items-center rounded-full'>
        <img
          className='h-52 w-52 shadow object-cover mix-blend-multiply rounded-full object-center hover:scale-110 transition-all duration-300'
          src={product.image}
        />
      </div>
      <p className='text-3xl capitalize font-bold text-zinc-900 transition-all duration-300 dark:text-zinc-200'>{product.name}</p>
      <span className='-mt-2 text-4xl uppercase font-thin text-zinc-500 dark:text-zinc-300 duration-300 transition-all'>$ {product.price}</span>
    </div>
  );
};

export default ProductCarouselItem;
