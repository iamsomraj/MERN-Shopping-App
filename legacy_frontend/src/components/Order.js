import React from "react";
import { Card, Col, ListGroup, Row, Table } from "react-bootstrap";
import Loader from "./Loader";
import { PayPalButton } from "react-paypal-button-v2";
import { Link } from "react-router-dom";

const Order = (props) => {
  const { order, onPay, loading, ready } = props;

  return (
    <Card>
      <Card.Header>Order #{order._id}</Card.Header>
      <Card.Body>
        <Card.Title>Total Price - ${order.totalPrice.toFixed(2)}</Card.Title>
        <Row>
          <Col md={8}>
            <ListGroup>
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
                      <strong className="text text-success">Successful</strong>
                    ) : (
                      <strong className="text text-danger">Not Paid Yet</strong>
                    )}
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            {!order.isPaymentDone && (
              <div>
                {loading && <Loader />}
                {!ready ? (
                  <Loader />
                ) : (
                  <PayPalButton
                    amount={order.totalPrice}
                    style={{
                      shape: "pill",
                    }}
                    onSuccess={(result) => onPay(order._id)}
                  />
                )}
              </div>
            )}
          </Col>
        </Row>
        <Row className="m-2">
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
                  <th scope="row">
                    <Link to={`/product/${item.product}`}>{index + 1}</Link>
                  </th>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{(item.qty * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Row>
      </Card.Body>
      <Card.Footer className="text-muted">
        Order placed {order.updatedAt}
      </Card.Footer>
    </Card>
  );
};

export default Order;
