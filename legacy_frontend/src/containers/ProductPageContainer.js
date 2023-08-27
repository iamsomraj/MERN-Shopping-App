import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { detailProduct } from "../redux/product/productActions";

const ProductPageContainer = (props) => {
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const productDetail = useSelector((state) => state.productDetail);

  const id = props.match.params.id;

  const { product, loading, error } = productDetail;

  const addToCartHandler = () => {
    props.history.push(`/cart/${id}?quantity=${quantity}`);
  };

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
                    <Col>In Stock:</Col>
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
                {product.isAvailable && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Quantity</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}>
                          {[...Array(product.qtyInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <Button
                        onClick={addToCartHandler}
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
