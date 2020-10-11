import {
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
} from "./userTypes";

export const userLoginReducer = (state = { user: {} }, action) => {
  const { type, action } = payload;
  switch (type) {
    case LOGIN_USER_REQUEST:
      return {
        loading: true,
      };
    case LOGIN_USER_SUCCESS: {
      return {
        loading: false,
        user: payload,
      };
    }
    case LOGIN_USER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};
