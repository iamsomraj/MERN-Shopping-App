import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
  PLACE_ORDER_INIT,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILURE,
  GET_ALL_ORDERS_REQUEST,
  GET_ALL_ORDERS_FAILURE,
  GET_ALL_ORDERS_SUCCESS,
  PAY_ORDER_REQUEST,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_FAILURE,
  PAY_ORDER_INIT,
} from "./orderTypes";
import Axios from "axios";

export const placeMyOrder = (items) => async (dispatch, getState) => {
  try {
    dispatch({ type: PLACE_ORDER_REQUEST });
    const products = items.map((product) => ({
      name: product.name,
      qty: product.quantity,
      price: product.price,
      product: product._id,
    }));
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.post("/api/orders/", { products }, config);
    dispatch({ type: PLACE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PLACE_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getMyOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ORDER_REQUEST });
    const config = {
      headers: {
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.get(`/api/orders/${id}`, config);
    dispatch({ type: GET_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getAllOrder = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_ALL_ORDERS_REQUEST });
    const config = {
      headers: {
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.get(`/api/orders/`, config);
    dispatch({ type: GET_ALL_ORDERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_ALL_ORDERS_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payMyOrder = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PAY_ORDER_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.put(`/api/orders/${id}`, null, config);
    dispatch({ type: PAY_ORDER_SUCCESS, payload: data });
    dispatch({ type: GET_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PAY_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const payInit = () => {
  return {
    type: PAY_ORDER_INIT,
  };
};

export const placeOrderInit = () => {
  return {
    type: PLACE_ORDER_INIT,
  };
};

