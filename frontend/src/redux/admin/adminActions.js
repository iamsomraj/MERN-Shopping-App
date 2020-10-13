import Axios from "axios";
import {
  ADMIN_ALL_USERS_REQUEST,
  ADMIN_ALL_USERS_FAILURE,
  ADMIN_ALL_USERS_SUCCESS,
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
