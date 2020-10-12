import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Order from "../components/Order";
import { getMyOrder, payMyOrder } from "../redux/order/orderActions";

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

  const payForOrder = (id) => {
    console.log("clicked in user orders");
    dispatch(payMyOrder(id));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : fetchedOrder ? (
        <Row className="justify-content-center">
          <Col>
            <Order
              order={fetchedOrder}
              onPay={() => payForOrder(fetchedOrder._id)}
            />
          </Col>
        </Row>
      ) : (
        <div>order could not be fetched</div>
      )}
    </>
  );
};

export default OrderPayPageContainer;
