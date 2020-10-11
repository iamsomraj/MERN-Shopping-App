import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import HomeContainer from "./containers/HomeContainer";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ProductPageContainer from "./containers/ProductPageContainer";
import CartPageContainer from "./containers/CartPageContainer";

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-4">
        <Container>
          <Route path="/" component={HomeContainer} exact />
          <Route path="/product/:id" component={ProductPageContainer} />
          <Route path="/cart/:id?" component={CartPageContainer} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
