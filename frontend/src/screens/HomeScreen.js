import React from "react";
import Products from "../products";
import { Row, Col } from "react-bootstrap";

const HomeScreen = () => {
  return (
    <>
      <h1>Showing Products</h1>
      <Row>
        {Products.map((product) => (
          <Col sm={12} md={6} lg={4} xl={3}>
            {product.name}
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
