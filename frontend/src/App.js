import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Container>
          <h1>this is the application</h1>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default App;
