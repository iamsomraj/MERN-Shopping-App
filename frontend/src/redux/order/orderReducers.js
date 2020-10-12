import { LOGOUT_USER } from "../user/userTypes";
import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
} from "./orderTypes";

export const placeOrderReducers = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case PLACE_ORDER_REQUEST: {
      return {
        loading: true,
      };
    }
    case PLACE_ORDER_SUCCESS: {
      return {
        loading: false,
        order: payload,
      };
    }
    case PLACE_ORDER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};
