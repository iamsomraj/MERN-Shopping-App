import React, { useEffect } from "react";
import { Row, Col, Card, Table, ListGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getMyOrder } from "../redux/order/orderActions";

const OrderPayPageContainer = ({ match, history }) => {
  const dispatch = useDispatch();

  const id = match.params.id;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const orderGet = useSelector((state) => state.orderGet);
  const { loading, error, fetchedOrder } = orderGet;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
      dispatch(getMyOrder(id));
    }
  }, [dispatch, history, user, id]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header>Order #{fetchedOrder._id}</Card.Header>
              <Card.Body>
                <Card.Title>
                  Total Price - ${fetchedOrder.totalPrice.toFixed(2)}
                </Card.Title>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>{fetchedOrder.user.name}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>{fetchedOrder.user.email}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        {fetchedOrder.isPaymentDone ? (
                          <div className="text text-success">
                            Payment Successful
                          </div>
                        ) : (
                          <div className="text text-danger">
                            Payment pending
                          </div>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
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
                    {fetchedOrder.products.map((item, index) => (
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
                <Button variant="primary" disabled={fetchedOrder.isPaymentDone}>
                  Pay ${fetchedOrder.totalPrice.toFixed(2)}
                </Button>
              </Card.Body>
              <Card.Footer className="text-muted">
                Order placed {fetchedOrder.updatedAt}
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default OrderPayPageContainer;
