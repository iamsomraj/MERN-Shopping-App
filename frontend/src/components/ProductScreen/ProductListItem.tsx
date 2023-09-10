import { IProduct } from '@/types';
import { Link } from 'react-router-dom';

type Props = {
  product: IProduct;
};

const ProductListItem = ({ product }: Props) => {
  return (
    <div className='group bg-zinc-50 md:flex rounded-xl border overflow-hidden'>
      <div className='h-60 w-full md:w-60 flex-shrink-0 bg-zinc-100 dark:bg-zinc-300 duration-300 transition-all p-6 flex justify-center items-center'>
        <img
          className='h-60 w-60 object-cover mix-blend-multiply object-center group-hover:scale-110 transition-all duration-300'
          src={product.image}
        />
      </div>
      <div className='p-6 flex flex-col md:flex-1 bg-zinc-50 dark:bg-zinc-800 gap-6 md:group-hover:px-9 transition-all duration-300'>
        <Link
          key={product._id}
          to={`/products/${product._id}`}>
          <h3 className='text-4xl font-medium text-zinc-900 line-clamp-1 dark:text-zinc-50 group-hover:underline'>{product.name}</h3>
        </Link>
        <h3 className='text-xl line-through font-medium text-red-500'>${(product.price * 1.5).toFixed(2)}</h3>
        <h3 className='text-6xl font-thin text-zinc-500'>${product.price}</h3>
      </div>
    </div>
  );
};

export default ProductListItem;
