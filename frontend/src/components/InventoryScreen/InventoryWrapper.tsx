import { deleteProduct, getProducts } from '@/api/products';
import ProductRowItem from '@/components/UI/ProductRowItem';
import { getErrorMessage } from '@/config';
import { IProduct } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const InventoryWrapper = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageNumberFromQuery = queryParams.get('page');

  useEffect(() => {
    if (pageNumberFromQuery) {
      setPage(Number(pageNumberFromQuery));
    }
  }, [pageNumberFromQuery]);

  const { isLoading, error, data } = useQuery({
    queryKey: [`inventory-${page}-products`],
    queryFn: async () => {
      return await getProducts(page);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while fetching inventory details!');
      toast.error(errorMessage);
    },
  });

  const { mutate: toggleProductAvailability, isLoading: productAvailabilityLoading } = useMutation({
    mutationFn: async (productId: string) => {
      return await deleteProduct(productId);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error, 'Error occurred while we were trying to update product details!');
      toast.error(errorMessage);
      setSelectedProductId(null);
    },
    onSuccess: (data) => {
      if (!data) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: [`inventory-${page}-products`] });
      toast.success('Product details updated!');
      setSelectedProductId(null);
    },
  });

  if (isLoading) return 'Loading...';

  if (error || !data) return 'Error occurred while fetching inventory details!';

  const deleteSingleItem = async (product: IProduct) => {
    setSelectedProductId(product._id);
    toggleProductAvailability(product._id);
  };

  const navigateToProductPage = (product: IProduct) => {
    navigate(`/products/${product._id}`);
  };

  const content = (
    <div className='flex flex-col gap-12'>
      <div className='flex flex-col text-center py-6 text-3xl gap-6 rounded-xl text-zinc-500 dark:text-zinc-300 duration-300 transition-all'>
        <p className='uppercase tracking-widest'>Inventory</p>
      </div>
      {data.products.map((product) => (
        <ProductRowItem
          key={product._id}
          product={product}
          deleteSingleItem={deleteSingleItem}
          redirectToProduct={navigateToProductPage}
          isRounded
          replaceQuantityWithStock
          isActionLoading={selectedProductId === product._id && productAvailabilityLoading}
        />
      ))}
    </div>
  );

  return content;
};

export default InventoryWrapper;
