import Axios from "axios";
import {
  GET_USER_PROFILE_FAILURE,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  UPDATE_USER_PROFILE_FAILURE,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
} from "./userTypes";
export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });
    const { data } = await Axios.post(
      "/api/users/login",
      { email, password }
    );
    dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: LOGIN_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("user");
  dispatch({ type: LOGOUT_USER });
};

export const registerUser = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const { data } = await Axios.post("/api/users/", { name, email, password });
    dispatch({ type: REGISTER_USER_SUCCESS, payload: data });
    dispatch({ type: LOGIN_USER_SUCCESS, payload: data });
    localStorage.setItem("user", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserProfile = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_PROFILE_REQUEST });
    const config = {
      headers: {
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.get("/api/users/profile", config);
    dispatch({ type: GET_USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_USER_PROFILE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserProfile = (name, email, password) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.put(
      "/api/users/profile",
      { name, email, password },
      config
    );
    dispatch({ type: UPDATE_USER_PROFILE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_PROFILE_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
