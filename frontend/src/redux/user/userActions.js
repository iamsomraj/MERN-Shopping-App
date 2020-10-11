import Axios from "axios";
import { LOGIN_USER_REQUEST } from "./userTypes";
export const loginUser = (email, password) => (dispatch) => {
  try {
    dispatch({ type: LOGIN_USER_REQUEST });
    const { data } = Axios.get("api/users/login");
  } catch (error) {}
};
