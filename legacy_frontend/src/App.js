import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AdminAllOrdersPageContainer from "./containers/AdminAllOrdersPageContainer";
import AdminAllProductsPageContainer from "./containers/AdminAllProductsPageContainer";
import AdminAllUserPageContainer from "./containers/AdminAllUserPageContainer";
import AdminCreateProductPageContainer from "./containers/AdminCreateProductPageContainer";
import AdminSingleUserPageContainer from "./containers/AdminSingleUserPageContainer";
import CartPageContainer from "./containers/CartPageContainer";
import HomePageContainer from "./containers/HomePageContainer";
import OrderOverviewPageContainer from "./containers/OrderOverviewPageContainer";
import PaymentPageContainer from "./containers/PaymentPageContainer";
import ProductPageContainer from "./containers/ProductPageContainer";
import UserLoginPageContainer from "./containers/UserLoginPageContainer";
import UserOrdersPageContainer from "./containers/UserOrdersPageContainer";
import UserProfilePageContainer from "./containers/UserProfilePageContainer";
import UserRegisterPageContainer from "./containers/UserRegisterPageContainer";

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
          <Route
            path="/admin/users"
            component={AdminAllUserPageContainer}
            exact
          />
          <Route
            path="/admin/users/:id"
            component={AdminSingleUserPageContainer}
            exact
          />
          <Route
            path="/admin/product/new"
            component={AdminCreateProductPageContainer}
          />
          <Route
            path="/admin/products/"
            component={AdminAllProductsPageContainer}
          />
          <Route
            path="/admin/orders/"
            component={AdminAllOrdersPageContainer}
            exact
          />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
