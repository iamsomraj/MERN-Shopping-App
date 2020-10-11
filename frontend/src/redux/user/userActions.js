import Axios from "axios";
import {
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
} from "./userTypes";
export const loginUser = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });
    const { data } = await Axios.post("api/users/login", { email, password });
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

export const registerUser = (name, email, password) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });
    const { data } = await Axios.post("api/users/", { name, email, password });
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
