import Axios from "axios";
import {
  ADMIN_ADD_PRODUCT_FAILURE,
  ADMIN_ADD_PRODUCT_INIT,
  ADMIN_ADD_PRODUCT_REQUEST,
  ADMIN_ADD_PRODUCT_SUCCESS,
  ADMIN_ALL_ORDERS_FAILURE,
  ADMIN_ALL_ORDERS_REQUEST,
  ADMIN_ALL_ORDERS_SUCCESS,
  ADMIN_ALL_USERS_FAILURE,
  ADMIN_ALL_USERS_REQUEST,
  ADMIN_ALL_USERS_SUCCESS,
  ADMIN_DELETE_PRODUCT_FAILURE,
  ADMIN_DELETE_PRODUCT_REQUEST,
  ADMIN_DELETE_PRODUCT_SUCCESS,
  ADMIN_DELETE_USER_FAILURE,
  ADMIN_DELETE_USER_REQUEST,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_SINGLE_USER_FAILURE,
  ADMIN_SINGLE_USER_REQUEST,
  ADMIN_SINGLE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAILURE,
  ADMIN_UPDATE_USER_REQUEST,
  ADMIN_UPDATE_USER_SUCCESS,
} from "./adminTypes";

export const adminGetAllUsers = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_ALL_USERS_REQUEST });
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.get("/api/users/", config);
      dispatch({ type: ADMIN_ALL_USERS_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_ALL_USERS_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminGetSingleUser = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_SINGLE_USER_REQUEST });
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.get("/api/users/" + id, config);
      dispatch({ type: ADMIN_SINGLE_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_SINGLE_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminUpdateUser = (id, name, email, password) => async (
  dispatch,
  getState
) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_UPDATE_USER_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.put(
        "/api/users/" + id,
        { name, email, password },
        config
      );
      dispatch({ type: ADMIN_UPDATE_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_UPDATE_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminDeleteUser = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_DELETE_USER_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.delete("/api/users/" + id, config);
      dispatch({ type: ADMIN_DELETE_USER_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_DELETE_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_DELETE_PRODUCT_REQUEST });
      const config = {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.delete("/api/products/" + id, config);
      dispatch({ type: ADMIN_DELETE_PRODUCT_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_DELETE_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const adminCreateProduct = (formData) => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_ADD_PRODUCT_REQUEST });
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.post("/api/products/", formData, config);
      dispatch({ type: ADMIN_ADD_PRODUCT_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_ADD_PRODUCT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProductInit = () => {
  return {
    type: ADMIN_ADD_PRODUCT_INIT,
  };
};

export const adminGetAllOrders = () => async (dispatch, getState) => {
  try {
    const {
      userLogin: {
        user: { token, isAdmin },
      },
    } = getState();
    if (isAdmin) {
      dispatch({ type: ADMIN_ALL_ORDERS_REQUEST });
      const config = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };
      const { data } = await Axios.get("/api/orders/admin/all", config);
      dispatch({ type: ADMIN_ALL_ORDERS_SUCCESS, payload: data });
    }
  } catch (error) {
    dispatch({
      type: ADMIN_ALL_ORDERS_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
