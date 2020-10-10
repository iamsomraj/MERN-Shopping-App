import React from "react";
import Products from "../products";

const ProductContainer = (props) => {
  const product = Products.find(
    (product) => product._id === props.match.params.id
  );
  return <div>Product {product.name}</div>;
};

export default ProductContainer;
