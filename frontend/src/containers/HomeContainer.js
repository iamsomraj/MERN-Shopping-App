import React, { useEffect } from "react";
import { Col, Pagination, Row } from "react-bootstrap";
import Product from "../components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../redux/product/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { LinkContainer } from "react-router-bootstrap";

const HomeScreen = ({ location }) => {
  const dispatch = useDispatch();
  const pageNumber = location.search.split("=")[1] || 1;
  useEffect(() => {
    dispatch(listProducts(pageNumber));
  }, [dispatch, pageNumber]);

  const productList = useSelector((state) => state.productList);
  const { loading, products, pages, page, error } = productList;

  return (
    <>
      <h1>Showing Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Row>
            <Col sm={12} md={6} lg={4} xl={3}>
              {pages > 1 && (
                <Pagination>
                  {[...Array(pages).keys()].map((pg) => (
                    <LinkContainer key={pg + 1} to={`/?page=${pg + 1}`}>
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

export default HomeScreen;
