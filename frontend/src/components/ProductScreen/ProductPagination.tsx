type ProductPaginationProps = {
  currentPage: number;
  totalPage: number;
};

const ProductPagination = (props: ProductPaginationProps) => {
  return (
    <>
      {/* BEGIN - PRODUCT PAGINATION */}
      <div>Product Pagination</div>
      <div>{JSON.stringify(props.currentPage)}</div>
      <div>{JSON.stringify(props.totalPage)}</div>
      {/* END - PRODUCT PAGINATION */}
    </>
  );
};

export default ProductPagination;
