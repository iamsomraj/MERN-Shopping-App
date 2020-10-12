import React, { useEffect } from "react";
import { Button, Card, Col, ListGroup, Row, Table } from "react-bootstrap";
import { useSelector } from "react-redux";

const PaymentPageContainer = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
    }
  }, [user, cartItems, history]);

  return (
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
            <Button variant="primary">Place Order</Button>
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
  );
};

export default PaymentPageContainer;
