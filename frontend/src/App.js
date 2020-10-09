import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Landing from "./components/layout/Landing";
import MyAlert from "./components/layout/MyAlert";
import Navbar from "./components/layout/Navbar";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Container className="m-5">
          <MyAlert />
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
          </Switch>
        </Container>
      </Router>
    </Provider>
  );
};

export default App;
