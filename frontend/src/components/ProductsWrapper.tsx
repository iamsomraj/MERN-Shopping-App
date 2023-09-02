import { Link } from 'react-router-dom';

const ProductsWrapper = () => {
  return (
    <div>
      <Link to={`products/1`}>Product</Link>
    </div>
  );
};

export default ProductsWrapper;
