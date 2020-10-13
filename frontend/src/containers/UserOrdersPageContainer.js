import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getAllOrder, payMyOrder } from "../redux/order/orderActions";
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
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : orders && orders.length > 0 ? (
        <div className="justify-content-center">
          <h1>Orders</h1>
          <Table className="my-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Price</th>
                <th>Total Item(s)</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Link to={"/orders/" + order._id}>{order._id}</Link>
                  </td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.products.reduce((aggr, curr) => aggr + curr.qty, 0)}
                  </td>
                  <td>{order.isPaymentDone ? "Paid" : "Pending"}</td>
                  <td>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>Order could not be fetched</div>
      )}
    </>
  );
};

export default UserOrdersPageContainer;
