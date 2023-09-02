import { IProduct } from '@/types';

type ProductListViewProps = {
  products: IProduct[];
};

const ProductListView = (props: ProductListViewProps) => {
  return (
    <>
      {/* BEGIN - PRODUCTS LIST VIEW */}
      <div>Product List View</div>
      {JSON.stringify(props.products.map((prod) => prod.name))}
      {/* END - PRODUCTS LIST VIEW */}
    </>
  );
};

export default ProductListView;
