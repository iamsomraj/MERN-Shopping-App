import React, { useEffect } from "react";
import { Button, Card, Col, Image, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { detailProduct } from "../redux/product/productActions";

const ProductPageContainer = (props) => {
  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.productDetail);

  const id = props.match.params.id;

  const { product, loading, error } = productDetail;

  useEffect(() => {
    dispatch(detailProduct(id));
  }, [dispatch, id]);

  return (
    <>
      <Link to="/" className="btn btn-primary my-3">
        Return to Home
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Row>
          <Col md={4}>
            <Image src={"../" + product.image} alt={product.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h2>{product.name}</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <h3>${product.price}</h3>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup>
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
                    <Col>Quantity:</Col>
                    <Col>
                      <strong>{product.qtyInStock}</strong>
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
                        {product.isAvailable ? "Available" : "Not Available"}
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
      )}
    </>
  );
};

export default ProductPageContainer;
