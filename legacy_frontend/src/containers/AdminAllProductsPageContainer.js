import React, { useEffect } from "react";
import { Button, Col, Image, Pagination, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { deleteProduct } from "../redux/admin/adminActions";
import { listProducts } from "../redux/product/productActions";

const AdminAllProductsPageContainer = ({ location, history }) => {
  const dispatch = useDispatch();
  const pageNumber = location.search.split("=")[1] || 1;

  const productList = useSelector((state) => state.productList);
  const { loading, products, pages, page, error } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { user } = userLogin;

  const adminDeleteProduct = useSelector((state) => state.adminDeleteProduct);
  const { product: deletedProduct } = adminDeleteProduct;

  useEffect(() => {
    if (!user) {
      history.push("/login");
    }

    if (user && !user.isAdmin) {
      history.push("/profile");
    }

    if (deletedProduct && deletedProduct._id) {
      dispatch(listProducts(pageNumber));
    }

    dispatch(listProducts(pageNumber));
  }, [dispatch, history, user, pageNumber, deletedProduct]);

  const deleteBtnHandler = (id) => {
    dispatch(deleteProduct(id));
    dispatch(listProducts(pageNumber));
  };

  return (
    <>
      <h1>List of Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id}>
                  <th scope="row">
                    <Link to={`/product/${product._id}`}>{index + 1}</Link>
                  </th>
                  <td>
                    <Link to={`/product/${product._id}`}>
                      <Image
                        height={40}
                        width={40}
                        src={"../../" + product.image}
                        fluid
                        rounded
                      />
                    </Link>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.qtyInStock}</td>
                  <td>{product.price.toFixed(2)}</td>
                  <td>{product.isAvailable ? "Available" : "Not Available"}</td>
                  <td>
                    {product.isAvailable ? (
                      <Button onClick={() => deleteBtnHandler(product._id)}>
                        Delete
                      </Button>
                    ) : (
                      <div className="text-muted">Product Deleted</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Row className="my-4">
            <Col sm={12} md={6} lg={4} xl={3}>
              {pages > 1 && (
                <Pagination size="sm">
                  {[...Array(pages).keys()].map((pg) => (
                    <LinkContainer
                      key={pg + 1}
                      to={`/admin/products/?page=${pg + 1}`}>
                      <Pagination.Item active={pg + 1 === page}>
                        {pg + 1}
                      </Pagination.Item>
                    </LinkContainer>
                  ))}
                </Pagination>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default AdminAllProductsPageContainer;
