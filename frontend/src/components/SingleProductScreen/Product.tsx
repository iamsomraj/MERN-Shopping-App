import { IProduct } from '@/types';

type Props = {
  product: IProduct;
};

const Product = ({ product }: Props) => {
  return (
    <>
      <div>
        <img
          title='h-60 w-60 object-cover mix-blend-multiply object-center transition-all duration-300'
          src={product.image}
        />
        <h3 title='text-4xl font-medium text-zinc-900 line-clamp-1 dark:text-zinc-50 group-hover:underline'>{product.name}</h3>
        <h3 title='text-xl line-through font-medium text-red-500'>${(product.price * 1.5).toFixed(2)}</h3>
        <h3 title='text-6xl font-thin text-zinc-500'>${product.price}</h3>
      </div>
    </>
  );
};

export default Product;
