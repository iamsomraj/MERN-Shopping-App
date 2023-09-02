import { IProduct } from '@/types';

type ProductCarouselProps = {
  products: IProduct[];
};

const ProductCarousel = (props: ProductCarouselProps) => {
  return (
    <>
      {/* BEGIN - PRODUCT SLIDER CAROUSEL */}
      <div className='w-full h-40 bg-zinc-100 flex justify-center items-center text-center'>
        <h2 className='text-zinc-500 text-3xl font-medium'>Product Carousel</h2>
        {JSON.stringify(props.products.map((prod) => prod.name))}
      </div>
      {/* END - PRODUCT SLIDER CAROUSEL */}
    </>
  );
};

export default ProductCarousel;
