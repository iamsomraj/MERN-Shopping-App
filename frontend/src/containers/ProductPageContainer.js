import React from "react";
import Products from "../products";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";

const ProductPageContainer = (props) => {
  const product = Products.find(
    (product) => product._id === props.match.params.id
  );
  return (
    <>
      <Link to="/" className="btn btn-primary my-3">
        Return to Home
      </Link>
      <Row>
        <Col md={6}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>{product.name}</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <h3>${product.price}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <small>Sold by: ${product.user}</small>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Available:</Col>
                  <Col>
                    <strong
                      className={
                        product.isAvailable ? "text-success" : "text-danger"
                      }>
                      {product.isAvailable ? "In Stock" : "Out Of Stock"}
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <Button
                      className="btn-block"
                      disabled={product.isAvailable === false}>
                      Add to cart
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProductPageContainer;
