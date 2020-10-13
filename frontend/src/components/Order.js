import React from "react";
import { Card, Col, ListGroup, Row, Table } from "react-bootstrap";
import { PayPalButton } from "react-paypal-button-v2";
import Loader from "./Loader";

const Order = (props) => {
  const { order, onPay, loading, ready } = props;

  return (
    <Card>
      <Card.Header>Order #{order._id}</Card.Header>
      <Card.Body>
        <Card.Title>Total Price - ${order.totalPrice.toFixed(2)}</Card.Title>
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
                  <strong className="text text-danger">Pending</strong>
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
        <Row className="justify-content-center">
          <Col md={8}>
            {!order.isPaymentDone && (
              <ListGroup>
                <ListGroup.Item>
                  {loading && <Loader />}
                  {!ready ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={(result) => onPay(order._id)}
                    />
                  )}
                </ListGroup.Item>
              </ListGroup>
            )}
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="text-muted">
        Order placed {order.updatedAt}
      </Card.Footer>
    </Card>
  );
};

export default Order;
