import React, { useEffect } from "react";
import { Col, ListGroup, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getAllOrder } from "../redux/order/orderActions";

const UserOrdersPageContainer = ({ history }) => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const userOrders = useSelector((state) => state.userOrders);
  const { loading, error, orders } = userOrders;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
      dispatch(getAllOrder());
    }
  }, [history, dispatch, user]);

  return (
    <>
      <Row>
        <Col md={8}>
          <h1>Orders</h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        orders &&
        orders.length > 0 && (
          <div className="justify-content-center">
            <Row>
              <Col md={8}>
                <Table className="my-4">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Price</th>
                      <th>Total Item(s)</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order._id}>
                        <th scope="row">
                          <Link to={"/orders/" + order._id}>{index + 1}</Link>
                        </th>
                        <td>{order.totalPrice}</td>
                        <td>
                          {order.products.reduce(
                            (aggr, curr) => aggr + curr.qty,
                            0
                          )}
                        </td>
                        <td>{order.isPaymentDone ? "Paid" : "Not Paid Yet"}</td>
                        <td>{order.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col md={4}>
                <ListGroup>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total Orders</strong>
                      </Col>
                      <Col>
                        <strong>{orders.length}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Total Spent</strong>
                      </Col>
                      <Col>
                        <strong>
                          $
                          {orders
                            .reduce((acc, item) => acc + item.totalPrice, 0)
                            .toFixed(2)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Transactions</strong>
                      </Col>
                      <Col>
                        <strong>
                          {orders.reduce((acc, item) => {
                            if (item.isPaymentDone) {
                              return acc + 1;
                            }
                            return acc + 0;
                          }, 0)}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </div>
        )
      )}
    </>
  );
};

export default UserOrdersPageContainer;
