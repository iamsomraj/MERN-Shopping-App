import React, { useEffect } from "react";
import { Card, Col, ListGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { adminGetAllOrders } from "../redux/admin/adminActions";

const AdminAllOrdersPageContainer = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const adminAllOrders = useSelector((state) => state.adminAllOrders);
  const { loading, orders, error } = adminAllOrders;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }

    if (user && !user.isAdmin) {
      history.push("/profile");
    }

    dispatch(adminGetAllOrders());
  }, [dispatch, user, history]);

  return (
    <>
      <h1>Showing Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          {orders.length !== 0 &&
            orders.map((order) => (
              <Row className="my-4  justify-content-center" key={order._id}>
                <Col md={8}>
                  <Card>
                    <Card.Header>Order #{order._id}</Card.Header>
                    <Card.Body>
                      <Card.Title>
                        Total Price - ${order.totalPrice.toFixed(2)}
                      </Card.Title>
                      <Row>
                        <Col>
                          <ListGroup>
                            <ListGroup.Item>
                              <Row>
                                <Col>ID</Col>
                                <Col>
                                  <Link to={`/admin/users/${order.user._id}`}>
                                    {order.user._id}
                                  </Link>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Row>
                                <Col>Name</Col>
                                <Col>{order.user.name}</Col>
                              </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Row>
                                <Col>Contact</Col>
                                <Col>{order.user.email}</Col>
                              </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                              <Row>
                                <Col>Payment Status</Col>
                                <Col>
                                  {order.isPaymentDone ? (
                                    <strong className="text text-success">
                                      Successful
                                    </strong>
                                  ) : (
                                    <strong className="text text-danger">
                                      Not Paid Yet
                                    </strong>
                                  )}
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          </ListGroup>
                        </Col>
                      </Row>
                      <Row className="m-4">
                        <Col>
                          <Card.Title>Order Details</Card.Title>
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
                              {order.products.map((item, index) => (
                                <tr key={item._id}>
                                  <th scope="row">{index + 1}</th>
                                  <td>{item.name}</td>
                                  <td>{item.qty}</td>
                                  <td>{item.price.toFixed(2)}</td>
                                  <td>{(item.qty * item.price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    </Card.Body>
                    <Card.Footer className="text-muted">
                      Order placed {order.createdAt}
                    </Card.Footer>
                  </Card>
                </Col>
              </Row>
            ))}
        </>
      )}
    </>
  );
};

export default AdminAllOrdersPageContainer;
