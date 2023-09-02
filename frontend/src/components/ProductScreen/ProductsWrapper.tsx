import { getProducts } from '@/api/products';
import ProductCarousel from '@/components/ProductScreen/ProductCarousel';
import ProductListView from '@/components/ProductScreen/ProductListView';
import ProductPagination from '@/components/ProductScreen/ProductPagination';
import { getErrorMessage } from '@/config';
import { selectPage, selectPages, selectProducts, setProducts } from '@/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const ProductsWrapper = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const page = useAppSelector(selectPage);
  const pages = useAppSelector(selectPages);

  const { isLoading, error } = useQuery({
    queryKey: [`${page}-products`],
    queryFn: async () => {
      return await getProducts(page);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching products!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      dispatch(
        setProducts({
          products: data.products,
          page: data.page,
          pages: data.pages,
        })
      );
    },
  });

  if (isLoading) return 'Loading...';

  if (error) return 'Error occurred while fetching products!';

  return (
    <div className='flex flex-col'>
      <ProductCarousel products={products} />
      <ProductListView products={products} />
      <ProductPagination
        currentPage={page}
        totalPage={pages}
      />
    </div>
  );
};

export default ProductsWrapper;
