import Button from '../UI/Button';

type ProductPaginationProps = {
  currentPage: number;
  totalPage: number;
};

const ProductPagination = (props: ProductPaginationProps) => {
  return (
    <>
      {/* BEGIN - PRODUCT PAGINATION */}
      <div className='flex justify-start gap-1 items-center'>
        {Array(props.totalPage)
          .fill(1)
          .map((_pageBtn, index) => (
            <Button
              key={index}
              variant='transparent'>
              <div className={index + 1 === props.currentPage ? 'text-2xl' : ''}>{index + 1}</div>
            </Button>
          ))}
      </div>
      {/* END - PRODUCT PAGINATION */}
    </>
  );
};

export default ProductPagination;
