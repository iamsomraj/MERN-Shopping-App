import {
  ADMIN_ALL_USERS_REQUEST,
  ADMIN_ALL_USERS_FAILURE,
  ADMIN_ALL_USERS_SUCCESS,
} from "./adminTypes";

export const adminAllUsersReducer = (state = { users: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_ALL_USERS_REQUEST: {
      return {
        ...state,
        loading: true,
      };
    }
    case ADMIN_ALL_USERS_SUCCESS: {
      console.log(payload);
      return {
        ...state,
        loading: false,
        users: payload,
      };
    }
    case ADMIN_ALL_USERS_FAILURE: {
      return {
        ...state,
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};
