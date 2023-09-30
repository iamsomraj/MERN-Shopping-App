import { getProducts } from '@/api/products';
import { getErrorMessage } from '@/config';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const InventoryWrapper = () => {
  const [page, setPage] = useState<number>(1);
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

  if (isLoading) return 'Loading...';

  if (error) return 'Error occurred while fetching inventory details!';

  const content = <div className='flex flex-col gap-12'>{JSON.stringify(data)}</div>;

  return content;
};

export default InventoryWrapper;
