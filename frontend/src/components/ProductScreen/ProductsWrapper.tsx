import ProductCarousel from '@/components/ProductScreen/ProductCarousel';
import ProductListView from '@/components/ProductScreen/ProductListView';
import ProductPagination from '@/components/ProductScreen/ProductPagination';

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
