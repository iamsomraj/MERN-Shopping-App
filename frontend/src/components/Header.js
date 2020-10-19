import React from "react";
import { Badge, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logoutUser } from "../redux/user/userActions";

const Header = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logoutUser());
  };

  return (
    <header>
      <Navbar bg="secondary" variant="dark" expand="lg" collapseOnSelect>
        <LinkContainer to="/">
          <Navbar.Brand>Coding Pillow Mart</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <LinkContainer to="/cart">
              <Nav.Link>
                Cart
                {cartItems.length !== 0 && (
                  <Badge className="mx-2" variant="success">
                    {cartItems.length}
                  </Badge>
                )}
              </Nav.Link>
            </LinkContainer>
            {user ? (
              <NavDropdown title={user.name} id="username">
                <LinkContainer to="/profile">
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/orders">
                  <NavDropdown.Item>Orders</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Item onClick={logoutHandler}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user && user.isAdmin && (
              <NavDropdown title="Admin" id="adminmenu">
                <LinkContainer to="/admin/users">
                  <NavDropdown.Item>All Users</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/orders/">
                  <NavDropdown.Item>All Orders</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/products/">
                  <NavDropdown.Item>All Products</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/admin/product/new">
                  <NavDropdown.Item>Product</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default Header;
