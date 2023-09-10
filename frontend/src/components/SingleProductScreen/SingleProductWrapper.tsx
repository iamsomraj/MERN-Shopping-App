import { getProduct } from '@/api/products';
import Product from '@/components/SingleProductScreen/Product';
import { getErrorMessage } from '@/config';
import { selectCurrentProduct, setCurrenProduct } from '@/features/product/productSlice';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const SingleProductWrapper = () => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const { productId } = useParams();
  const { isLoading, error } = useQuery({
    queryKey: [`product-${productId}`],
    queryFn: async () => {
      if (!productId) {
        return;
      }
      return await getProduct(productId);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching product detail!');
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      dispatch(
        setCurrenProduct({
          currentProduct: data,
        })
      );
    },
  });

  if (isLoading) return 'Loading...';

  if (error || !product) return 'Error occurred while fetching product!';

  const content = (
    <div>
      <Product product={product} />
    </div>
  );

  return content;
};

export default SingleProductWrapper;
