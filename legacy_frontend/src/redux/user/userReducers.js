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

export const userProfileReducer = (state = { userInfo: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_USER_PROFILE_REQUEST:
      return {
        loading: true,
      };
    case GET_USER_PROFILE_SUCCESS: {
      return {
        loading: false,
        userInfo: payload,
      };
    }
    case GET_USER_PROFILE_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    case LOGOUT_USER: {
      return {
        userInfo: {},
      };
    }
    default:
      return state;
  }
};

export const userProfileUpdateReducer = (
  state = { updatedUser: {} },
  action
) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_USER_PROFILE_REQUEST:
      return {
        loading: true,
      };
    case UPDATE_USER_PROFILE_SUCCESS: {
      return {
        loading: false,
        success: true,
        updatedUser: payload,
      };
    }
    case UPDATE_USER_PROFILE_FAILURE: {
      return {
        loading: false,
        fail: true,
        error: payload,
      };
    }
    case LOGOUT_USER: {
      return { updatedUser: {} };
    }
    default:
      return state;
  }
};
