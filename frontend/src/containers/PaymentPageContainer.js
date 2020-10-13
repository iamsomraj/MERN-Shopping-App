import Axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Order from "../components/Order";
import { getMyOrder, payInit, payMyOrder } from "../redux/order/orderActions";

const PaymentPageContainer = ({ match, history }) => {
  const dispatch = useDispatch();

  const [isPaypalReady, setIsPaypalReady] = useState(false);

  const id = match.params.id;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const orderGet = useSelector((state) => state.orderGet);
  const { loading, error, fetchedOrder } = orderGet;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay, order } = orderPay;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await Axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setIsPaypalReady(true);
      };
      document.body.appendChild(script);
    };
    if (!fetchedOrder || successPay || fetchedOrder._id !== id) {
      dispatch(payInit());
      dispatch(getMyOrder(id));
    } else if (!fetchedOrder.isPaymentDone) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setIsPaypalReady(true);
      }
    }
  }, [dispatch, history, order, user, fetchedOrder, successPay, id]);

  const payForOrder = (id) => {
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
              loading={loadingPay}
              ready={isPaypalReady}
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

export default PaymentPageContainer;
