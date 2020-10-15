import React from "react";
import { Badge, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = (props) => {
  const { product } = props;

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
            {!product.isAvailable && (
              <Badge className="mx-2" variant="danger">
                Unavailable
              </Badge>
            )}
          </Card.Title>
        </Link>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
