import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { loginUser } from "../redux/user/userActions";

const UserLoginPageContainer = ({ history }) => {
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const { email, password } = loginForm;
  const onChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, user, error } = userLogin;

  const loginFormHandler = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser(email, password));
    }
  };

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [history, user]);
  return (
    <>
      <Row className="my-5 justify-content-center">
        <Col lg={6}>
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
          <h1>Login</h1>
          <Form>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                value={email}
                onChange={(e) => onChange(e)}
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                value={password}
                onChange={(e) => onChange(e)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button onClick={(e) => loginFormHandler(e)}>Login</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserLoginPageContainer;
