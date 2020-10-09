import { DEL_ALERT, SET_ALERT } from "./alertTypes";

const initialState = {
  header: "",
  message: "",
  color: "",
};

const alertReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      return {
        ...state,
        header: payload.header,
        message: payload.message,
        color: payload.color,
      };
    case DEL_ALERT:
      return {
        ...state,
        header: "",
        message: "",
        color: "",
      };
    default:
      return state;
  }
};

export default alertReducer;
