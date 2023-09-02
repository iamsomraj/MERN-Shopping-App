import { IProduct } from '@/types';

type Props = {
  product: IProduct;
};

const ProductCarouselItem = ({ product }: Props) => {
  return (
    <div className='flex flex-col gap-9 items-center'>
      <div className='bg-white p-6 w-fit flex justify-center items-center rounded-full'>
        <img
          className='h-52 w-52  shadow object-cover mix-blend-multiply rounded-full object-center hover:scale-110 transition-all duration-300'
          src={product.image}
        />
      </div>
      <p className='text-3xl capitalize font-bold text-zinc-900'>{product.name}</p>
      <span className='-mt-2 text-2xl uppercase font-bold text-zinc-500'>$ {product.price}</span>
    </div>
  );
};

export default ProductCarouselItem;
