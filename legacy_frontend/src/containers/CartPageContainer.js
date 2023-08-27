import React, { useEffect } from "react";
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
import Message from "../components/Message";
import { addItemToCart, deleteItemFromCart } from "../redux/cart/cartActions";

const CartPageContainer = ({ match, location, history }) => {
  const productId = match.params.id;

  const quantity = location.search ? Number(location.search.split("=")[1]) : 1;

  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  useEffect(() => {
    if (productId) {
      dispatch(addItemToCart(productId, quantity));
    }
  }, [dispatch, productId, quantity]);

  const deleteHandler = (id) => {
    dispatch(deleteItemFromCart(id));
  };

  const orderHandler = () => {
    if (user) {
      history.push("/neworder");
    }
  };

  return (
    <>
      <Row>
        <Col className="my-3">
          <h1>Shopping Cart</h1>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <Message variant="primary">
              You have no items in the cart
            </Message>
          ) : (
            <ListGroup fluid="true">
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image
                        src={"../" + item.image}
                        alt={item.name}
                        fluid
                        rounded
                      />
                    </Col>
                    <Col>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    <Col>${item.price}</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={item.quantity}
                        onChange={(e) =>
                          dispatch(
                            addItemToCart(item._id, Number(e.target.value))
                          )
                        }>
                        {[...Array(item.qtyInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col>
                      <Button
                        type="button"
                        onClick={() => deleteHandler(item._id)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <h4>Total Items</h4>
                  </Col>
                  <Col>
                    <h4>
                      {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </h4>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <h4>Total Price</h4>
                  </Col>
                  <Col>
                    <h4>
                      $
                      {cartItems
                        .reduce(
                          (acc, item) => acc + item.quantity * item.price,
                          0
                        )
                        .toFixed(2)}
                    </h4>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0 || !user}
                  onClick={orderHandler}>
                  Order Now
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default CartPageContainer;
