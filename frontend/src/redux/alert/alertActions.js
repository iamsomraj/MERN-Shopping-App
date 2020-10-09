import { DEL_ALERT, SET_ALERT } from "./alertTypes";

export const setAlert = (header, message, color) => (dispatch) => {
  dispatch({
    type: SET_ALERT,
    header,
    message,
    color,
  });
  setTimeout(dispatch({ type: DEL_ALERT }), 5000);
};
