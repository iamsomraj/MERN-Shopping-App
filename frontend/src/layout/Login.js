import React, { Fragment, useState } from "react";
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";
import { useDispatch } from "react-redux";
import { setAlert } from "../../redux/alert/alertActions";

const Login = (props) => {
  const initialState = {
    email: "",
    password: "",
  };

  const dispatch = useDispatch();

  const [loginForm, setLoginForm] = useState(initialState);

  const { email, password } = loginForm;

  const onChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      console.log(loginForm);
    } else {
      dispatch(setAlert("Form Error", "Some form fields are blank", "danger"));
    }
  };

  return (
    <Fragment>
      <div className="pt-3 pb-3 display-4">Sign In</div>
      <div className="pt-3 pb-3 lead">Log into your account</div>
      <Form onSubmit={(e) => onSubmit(e)} autoComplete="off">
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => onChange(e)}
            placeholder="Your Email"
          />
          <FormText>We'll never share your email with anyone else</FormText>
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => onChange(e)}
            placeholder="Your Password"
          />
        </FormGroup>
        <Button>Login</Button>
      </Form>
    </Fragment>
  );
};

export default Login;
