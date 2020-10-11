import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { getUserProfile } from "../redux/user/userActions";

const UserProfilePageContainer = ({ history }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.userProfile);
  const { loading, userInfo, error } = userProfile;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const profileUpdateFormHandler = (e) => {
    e.preventDefault();
    if (name && email && password) {
      console.log("clicked");
    }
  };

  useEffect(() => {
    if (!user) {
      history.push("/login");
    } else {
      if (!userInfo || !userInfo.name) {
        dispatch(getUserProfile());
      } else {
        setName(userInfo.name);
        setEmail(userInfo.email);
      }
    }
  }, [history, dispatch, userInfo, user]);

  return (
    <>
      <Row className="my-5 justify-content-center">
        <Col lg={6}>
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
          <Form>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter full name"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            <Button onClick={(e) => profileUpdateFormHandler(e)}>Update</Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UserProfilePageContainer;
