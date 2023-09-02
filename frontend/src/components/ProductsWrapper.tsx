import ProductCarousel from '@/components/ProductCarousel';
import ProductListView from '@/components/ProductListView';
import ProductPagination from '@/components/ProductPagination';

const ProductsWrapper = () => {
  return (
    <div className='flex flex-col'>
      <ProductCarousel />
      <ProductListView />
      <ProductPagination />
    </div>
  );
};

export default ProductsWrapper;
