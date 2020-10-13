import {
  ADMIN_ALL_USERS_REQUEST,
  ADMIN_ALL_USERS_FAILURE,
  ADMIN_ALL_USERS_SUCCESS,
  ADMIN_SINGLE_USER_REQUEST,
  ADMIN_SINGLE_USER_SUCCESS,
  ADMIN_SINGLE_USER_FAILURE,
  ADMIN_UPDATE_USER_REQUEST,
  ADMIN_UPDATE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAILURE,
  ADMIN_DELETE_USER_REQUEST,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_DELETE_USER_FAILURE,
} from "./adminTypes";

import Axios from "axios";

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
