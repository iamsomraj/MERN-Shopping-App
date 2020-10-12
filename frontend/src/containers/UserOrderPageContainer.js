import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Order from "../components/Order";
import { getAllOrder } from "../redux/order/orderActions";

const UserOrderPageContainer = ({ history }) => {
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
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : orders && orders.length > 0 ? (
        <div className="justify-content-center">
          <h1>Orders</h1>
          {orders.map((order) => (
            <Row className="my-4" key={order._id}>
              <Col>
                <Order order={order} />
              </Col>
            </Row>
          ))}
        </div>
      ) : (
        <div>order could not be fetched</div>
      )}
    </>
  );
};

export default UserOrderPageContainer;
