import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomePageContainer from "./containers/HomePageContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProductPageContainer from "./containers/ProductPageContainer";
import CartPageContainer from "./containers/CartPageContainer";
import UserLoginPageContainer from "./containers/UserLoginPageContainer";
import UserRegisterPageContainer from "./containers/UserRegisterPageContainer";
import UserProfilePageContainer from "./containers/UserProfilePageContainer";
import UserOrdersPageContainer from "./containers/UserOrdersPageContainer";
import OrderOverviewPageContainer from "./containers/OrderOverviewPageContainer";
import PaymentPageContainer from "./containers/PaymentPageContainer";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Container>
          <Route path="/" component={HomePageContainer} exact />
          <Route path="/product/:id" component={ProductPageContainer} />
          <Route path="/cart/:id?" component={CartPageContainer} />
          <Route path="/neworder" component={OrderOverviewPageContainer} />
          <Route path="/orders/:id" component={PaymentPageContainer} exact />
          <Route path="/login" component={UserLoginPageContainer} />
          <Route path="/register" component={UserRegisterPageContainer} />
          <Route path="/profile" component={UserProfilePageContainer} />
          <Route path="/orders" component={UserOrdersPageContainer} exact />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
