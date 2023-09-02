import { IProduct } from '@/types';
import React from 'react';

type Props = {
  product: IProduct;
};

const ProductListItem = ({ product }: Props) => {
  return (
    <div className='group bg-white md:flex gap-4 rounded-xl border overflow-hidden'>
      <div className='bg-zinc-100 p-6 flex justify-center items-center'>
        <img
          className='h-60 w-60 object-cover mix-blend-multiply object-center group-hover:scale-110 transition-all duration-300'
          src={product.image}
        />
      </div>
      <div className='p-6 flex flex-col gap-6 group-hover:px-3 transition-all duration-300'>
        <h3 className='text-4xl font-medium text-zinc-900 group-hover:underline'>{product.name}</h3>
        <div className='text-2xl font-medium text-zinc-500'>Price</div>
        <div className='flex gap-6 items-center'>
          <h3 className='text-xl line-through font-medium text-red-500'>${(product.price * 1.5).toFixed(2)}</h3>
          <h3 className='text-4xl font-medium text-zinc-500'>${product.price}</h3>
        </div>
      </div>
    </div>
  );
};

export default ProductListItem;
