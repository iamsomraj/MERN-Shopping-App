import {
  LOGIN_USER_FAILURE,
  LOGIN_USER_REQUEST,
  LOGIN_USER_SUCCESS,
  LOGOUT_USER,
  REGISTER_USER_FAILURE,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
} from "./userTypes";

export const userLoginReducer = (state = {}, action) => {
  const { type, payload } = action;
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
    case LOGOUT_USER: {
      return {};
    }
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_USER_REQUEST:
      return {
        loading: true,
      };
    case REGISTER_USER_SUCCESS: {
      return {
        loading: false,
        user: payload,
      };
    }
    case REGISTER_USER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    case LOGOUT_USER: {
      return {};
    }
    default:
      return state;
  }
};
