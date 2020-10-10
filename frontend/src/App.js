import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import Login from "./Layout/Login";
import Register from "./Layout/Register";
import Landing from "./Layout/Landing";
import Navbar from "./Layout/NavbarLayout";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Container className="mt-4">
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
