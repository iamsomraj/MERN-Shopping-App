import React from "react";
import { Button, Form, FormControl, Nav, Navbar } from "react-bootstrap";

const Header = () => {
  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Navbar.Brand href="/">Coding Pillow Shop</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Form className="mr-auto" inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="secondary">Search</Button>
          </Form>
          <Nav className="ml-auto">
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
