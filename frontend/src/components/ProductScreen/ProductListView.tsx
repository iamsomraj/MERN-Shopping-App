import { IProduct } from '@/types';
import { Link } from 'react-router-dom';
import ProductListItem from './ProductListItem';

type ProductListViewProps = {
  products: IProduct[];
};

const ProductListView = (props: ProductListViewProps) => {
  return (
    <>
      {/* BEGIN - HUGE DISCOUNT IS LIVE BANNER */}
      <div className='flex flex-col text-center py-6 text-3xl gap-6 rounded-xl text-zinc-500 dark:text-zinc-300 duration-300 transition-all'>
        <p className='uppercase'>Huge Discounts are live!</p>
        <div className='text-5xl font-thin duration-300 transition-all tracking-widest animate-pulse'>End of Season Sale</div>
        <span className='text-xl font-extralight uppercase'>Upto 30% Discount</span>
      </div>
      {/* BEGIN - HUGE DISCOUNT IS LIVE BANNER */}

      {/* BEGIN - PRODUCTS LIST VIEW */}
      <div className='grid col-span-1 md:grid-cols-2 gap-12'>
        {props.products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}>
            <ProductListItem product={product} />
          </Link>
        ))}
      </div>
      {/* END - PRODUCTS LIST VIEW */}
    </>
  );
};

export default ProductListView;
