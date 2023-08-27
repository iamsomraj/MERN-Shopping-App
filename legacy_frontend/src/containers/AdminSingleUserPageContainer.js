import React, { useEffect, useState } from "react";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  adminDeleteUser,
  adminGetSingleUser,
  adminUpdateUser,
} from "../redux/admin/adminActions";

const AdminSingleUserPageContainer = ({ match, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { user: loggedInUser } = userLogin;

  const adminSingleUser = useSelector((state) => state.adminSingleUser);
  const { user, loading, error } = adminSingleUser;


  const id = match.params.id;

  useEffect(() => {
    if (!loggedInUser) {
      history.push("/login");
    }

    if (loggedInUser && !loggedInUser.isAdmin) {
      history.push("/profile");
    }

    if (!user || !user.name || user._id !== id) {
      dispatch(adminGetSingleUser(id));
    } else {
      setName(user.name);
      setEmail(user.email);
    }
  }, [dispatch, user, id, history, loggedInUser]);

  const deleteHandler = (delId) => {
    dispatch(adminDeleteUser(delId));
    history.push("/admin/users");
  };

  return (
    <>
      <Link to="/admin/users" className="btn btn-primary my-3">
        Return to All Users
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <Row className="justify-content-center">
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <small>{user._id}</small>
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter full name"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Form.Control
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter Password"
                />
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  onClick={() => {
                    dispatch(adminUpdateUser(id, name, email, password));
                    dispatch(adminGetSingleUser(id));
                  }}>
                  Update
                </Button>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  className="btn-block btn-danger"
                  onClick={() => deleteHandler(user._id)}>
                  Delete
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  );
};

export default AdminSingleUserPageContainer;
