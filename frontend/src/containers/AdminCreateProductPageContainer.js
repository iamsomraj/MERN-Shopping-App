import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  adminCreateProduct,
  createProductInit,
} from "../redux/admin/adminActions";

const AdminCreateProductPageContainer = ({ history }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState(null);
  const [qtyInStock, setQtyInStock] = useState(0);

  const dispatch = useDispatch();

  const adminAddProduct = useSelector((state) => state.adminAddProduct);
  const { loading, error, success } = adminAddProduct;

  const uploadFileHandler = (e) => {
    let file = e.target.files[0];
    setImage(file);
  };
  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }

    if (user && !user.isAdmin) {
      history.push("/profile");
    }

    if (success) {
      setTimeout(() => {
        history.push("/");
        dispatch(createProductInit());
      }, 3000);
    }
  }, [success, dispatch, user, history]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("image", image, image.name);
    formData.append("qtyInStock", qtyInStock);
    dispatch(adminCreateProduct(formData));
  };

  return (
    <>
      <Row className="my-5 justify-content-center">
        <Col lg={6}>
          <h1>Create Product</h1>
          <Link to="/" className="btn btn-primary my-3">
            Go to Home
          </Link>
          {loading && <Loader />}
          {error && <Message>{error}</Message>}
          {success && (
            <>
              <Message variant="success">Product is created</Message>
              <Message variant="success">Image is uploading</Message>
              <Loader />
            </>
          )}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.File
                id="image"
                label="Image"
                onChange={uploadFileHandler}></Form.File>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Quantity In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={qtyInStock}
                onChange={(e) => setQtyInStock(e.target.value)}></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Product
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AdminCreateProductPageContainer;
