import { DEL_ALERT, SET_ALERT } from "./alertTypes";

export const setAlert = (header, message, color) => (dispatch) => {
  dispatch({
    type: SET_ALERT,
    payload: {
      header,
      message,
      color,
    },
  });
  setTimeout(() => {
    dispatch(delAlert());
  }, 3000);
};

export const delAlert = () => {
  return {
    type: DEL_ALERT,
  };
};
