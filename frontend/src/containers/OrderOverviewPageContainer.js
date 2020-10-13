import React, { useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  ListGroup,
  Row,
  Table,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getMyOrder, placeMyOrder } from "../redux/order/orderActions";
import { Redirect } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderOverviewPageContainer = ({ history }) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const orderPlace = useSelector((state) => state.orderPlace);
  const { loading, error, success, placedOrder } = orderPlace;

  const orderGet = useSelector((state) => state.orderGet);
  const { fetchedOrder } = orderGet;

  const placeOrderHandler = () => {
    dispatch(placeMyOrder(cartItems));
  };

  const payOrderHandler = (id) => {
    if (placedOrder) dispatch(getMyOrder(placedOrder._id));
  };

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }
  }, [user, cartItems, fetchedOrder, history]);

  return user && user.name ? (
    loading ? (
      <Loader />
    ) : error ? (
      <Message>{error}</Message>
    ) : (
      <>
        <Row>
          <Col md={8}>
            {success && (
              <Message variant="success">Order placed successfully</Message>
            )}
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>Order Overview</Card.Header>
              <Card.Body>
                <Card.Title>Total Items {cartItems.length}</Card.Title>
                <Card.Title>
                  Sub Total - $
                  {cartItems
                    .reduce((acc, item) => acc + item.quantity * item.price, 0)
                    .toFixed(2)}
                </Card.Title>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Quanity</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toFixed(2)}</td>
                        <td>{(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <ButtonGroup>
                  <Button variant="primary" onClick={placeOrderHandler}>
                    Place Order
                  </Button>
                  <Button
                    variant="primary"
                    disabled={!placedOrder}
                    onClick={payOrderHandler}>
                    Proceed to Payment
                  </Button>
                </ButtonGroup>
              </Card.Body>
              <Card.Footer className="text-muted">
                Signed in as : {user.name}
              </Card.Footer>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Buyer Info</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <>Name</>
                    </Col>
                    <Col>
                      <>{user.name}</>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <>Email</>
                    </Col>
                    <Col>
                      <>{user.email}</>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )
  ) : (
    <Redirect to="/login" />
  );
};

export default OrderOverviewPageContainer;
