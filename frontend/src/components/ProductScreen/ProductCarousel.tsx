import ProductCarouselItem from '@/components/ProductScreen/ProductCarouselItem';
import Button from '@/components/UI/Button';
import { IProduct } from '@/types';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

type ProductCarouselProps = {
  products: IProduct[];
};

const ProductCarousel = (props: ProductCarouselProps) => {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (props.products.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % props.products.length;
        return newIndex;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [props.products]);

  const product = useMemo(() => {
    const currentProduct = props.products.find((_productItem, ind) => ind === index);
    return currentProduct;
  }, [props.products, index]);

  const changeToPrevious = () => {
    setIndex((prevIndex) => {
      let newIndex = prevIndex - 1;
      if (newIndex < 0) {
        newIndex = props.products.length - 1;
      }
      return newIndex;
    });
  };

  const changeToNext = () => {
    setIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % props.products.length;
      return newIndex;
    });
  };

  if (!product) return null;

  return (
    <>
      {/* BEGIN - PRODUCT SLIDER CAROUSEL */}
      <div className='relative w-full py-12 bg-zinc-100 dark:bg-zinc-700 duration-300 transition-all flex justify-center items-center text-center'>
        <Button
          variant='transparent'
          onClick={() => changeToPrevious()}>
          <ArrowLeftIcon className='absolute h-6 w-6 left-5 top-[50%] transform -translate-y-1/2 opacity-50' />
        </Button>
        <Link to={`/products/${product._id}`}>
          <ProductCarouselItem product={product} />
        </Link>
        <Button
          variant='transparent'
          onClick={() => changeToNext()}>
          <ArrowRightIcon className='absolute h-6 w-6 right-5 top-[50%] transform -translate-y-1/2 opacity-50' />
        </Button>
      </div>
      {/* END - PRODUCT SLIDER CAROUSEL */}
    </>
  );
};

export default ProductCarousel;
