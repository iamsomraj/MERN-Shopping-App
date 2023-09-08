import { Link } from 'react-router-dom';

type ProductPaginationProps = {
  currentPage: number;
  totalPage: number;
};

const ProductPagination = (props: ProductPaginationProps) => {
  return (
    <>
      {/* BEGIN - PRODUCT PAGINATION */}
      <div className='flex justify-start gap-6 items-center'>
        {Array(props.totalPage)
          .fill(1)
          .map((_pageBtn, index) => (
            <Link
              key={index}
              to={`?page=${index + 1}`}
              onClick={() => {
                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                });
              }}>
              <div className={index + 1 === props.currentPage ? 'text-4xl font-thin' : 'text-sm'}>{index + 1}</div>
            </Link>
          ))}
      </div>
      {/* END - PRODUCT PAGINATION */}
    </>
  );
};

export default ProductPagination;
