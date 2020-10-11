import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { registerUser } from "../redux/user/userActions";

const UserRegisterPageContainer = ({ history }) => {
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = registerForm;
  const onChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value,
    });
  };

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, user, error } = userRegister;

  const registerFormHandler = (e) => {
    e.preventDefault();
    if (name && email && password) {
      dispatch(registerUser(name, email, password));
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
          <h1>Register</h1>
          <Form>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                value={name}
                onChange={(e) => onChange(e)}
                type="text"
                placeholder="Enter full name"
              />
            </Form.Group>
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
            <Button onClick={(e) => registerFormHandler(e)}>Register</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserRegisterPageContainer;
