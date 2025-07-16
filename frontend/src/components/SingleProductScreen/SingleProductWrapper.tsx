import { getProduct } from '@/api/products';
import Product from '@/components/SingleProductScreen/Product';
import { getErrorMessage } from '@/config';
import { selectCurrentProduct, setCurrenProduct } from '@/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

const SingleProductWrapper = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const { productId } = useParams();
  const { isPending, error, data } = useQuery({
    queryKey: [`product-${productId}`],
    queryFn: async () => {
      if (!productId) {
        return undefined;
      }
      return await getProduct(productId);
    },
    enabled: !!productId,
  });

  // Handle success and error in useEffect for TanStack Query v5
  useEffect(() => {
    if (error) {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching product detail!');
      toast.error(errorMessage);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      dispatch(
        setCurrenProduct({
          currentProduct: data,
        })
      );
    }
  }, [data, dispatch]);

  if (isPending) return 'Loading...';

  if (error || !product) return 'Error occurred while fetching product!';

  const content = (
    <div>
      <Product product={product} />
    </div>
  );

  return content;
};

export default SingleProductWrapper;
