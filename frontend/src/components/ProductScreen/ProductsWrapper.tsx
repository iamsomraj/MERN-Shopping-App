import { getProducts } from '@/api/products';
import ProductCarousel from '@/components/ProductScreen/ProductCarousel';
import ProductListView from '@/components/ProductScreen/ProductListView';
import ProductPagination from '@/components/ProductScreen/ProductPagination';
import { getErrorMessage } from '@/config';
import { selectPage, selectPages, selectProducts, setPage, setProducts } from '@/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ProductsWrapper = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumberFromQuery = queryParams.get('page');
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const page = useAppSelector(selectPage);
  const pages = useAppSelector(selectPages);

  useEffect(() => {
    if (pageNumberFromQuery) {
      dispatch(
        setPage({
          page: Number(pageNumberFromQuery),
        })
      );
    }
  }, [pageNumberFromQuery, dispatch]);

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

  const content = (
    <div className='flex flex-col gap-12'>
      <ProductCarousel products={products} />
      <ProductListView products={products} />
      <ProductPagination
        currentPage={page}
        totalPage={pages}
      />
    </div>
  );

  return content;
};

export default ProductsWrapper;
