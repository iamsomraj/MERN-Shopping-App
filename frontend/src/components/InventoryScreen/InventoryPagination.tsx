import Button from '../UI/Button';

type InventoryPaginationProps = {
  currentPage: number;
  totalPage: number;
  fetchInventoryByPage: (page: number) => void;
};

const InventoryPagination = (props: InventoryPaginationProps) => {
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
              onClick={() => props.fetchInventoryByPage(index + 1)}>
              <div className={`${index + 1 === props.currentPage ? 'underline underline-offset-4' : ''} text-xl font-bold  p-2 rounded-lg`}>{index + 1}</div>
            </Button>
          ))}
      </div>
      {/* END - PRODUCT PAGINATION */}
    </>
  );
};

export default InventoryPagination;
