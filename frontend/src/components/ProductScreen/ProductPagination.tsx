import { useNavigate } from 'react-router-dom';
import Button from '../UI/Button';

type ProductPaginationProps = {
  currentPage: number;
  totalPage: number;
};

const ProductPagination = (props: ProductPaginationProps) => {
  const navigate = useNavigate();
  return (
    <>
      {/* BEGIN - PRODUCT PAGINATION */}
      <div className='flex justify-start gap-6 items-center'>
        {Array(props.totalPage)
          .fill(1)
          .map((_pageBtn, index) => (
            <Button
              variant='transparent'
              key={index}
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
                navigate(`?page=${index + 1}`);
              }}>
              <div className={index + 1 === props.currentPage ? 'text-4xl font-thin' : 'text-sm'}>{index + 1}</div>
            </Button>
          ))}
      </div>
      {/* END - PRODUCT PAGINATION */}
    </>
  );
};

export default ProductPagination;
