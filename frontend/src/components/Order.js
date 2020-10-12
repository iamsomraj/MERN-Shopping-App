import React from "react";
import { Button, Card, ListGroup, Table, Row, Col } from "react-bootstrap";

const Order = (props) => {
  const { order } = props;

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
              <Col>
                {order.isPaymentDone ? (
                  <div className="text text-success">Payment Successful</div>
                ) : (
                  <div className="text text-danger">Payment pending</div>
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
        <Button variant="primary" disabled={order.isPaymentDone}>
          Pay ${order.totalPrice.toFixed(2)}
        </Button>
      </Card.Body>
      <Card.Footer className="text-muted">
        Order placed {order.updatedAt}
      </Card.Footer>
    </Card>
  );
};

export default Order;
