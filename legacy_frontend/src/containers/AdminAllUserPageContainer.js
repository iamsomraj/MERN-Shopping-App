import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import User from "../components/User";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { adminGetAllUsers } from "../redux/admin/adminActions";

const AdminAllUserPageContainer = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const adminAllUsers = useSelector((state) => state.adminAllUsers);
  const { loading, users, error } = adminAllUsers;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }

    if (user && !user.isAdmin) {
      history.push("/profile");
    }

    dispatch(adminGetAllUsers());
  }, [dispatch, user, history]);

  return (
    <>
      <h1>Showing Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Row>
            {users.length !== 0 &&
              users.map((user) => (
                <Col key={user._id} sm={12} md={6} lg={4} xl={3}>
                  <User user={user} />
                </Col>
              ))}
          </Row>
        </>
      )}
    </>
  );
};

export default AdminAllUserPageContainer;
