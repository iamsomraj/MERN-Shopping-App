import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILURE,
} from "./orderTypes";

export const placeOrderReducer = (state = {}, action) => {
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
        success: true,
        placedOrder: payload,
      };
    }
    case PLACE_ORDER_FAILURE: {
      return {
        loading: false,
        fail: true,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const getOrderReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ORDER_REQUEST: {
      return {
        loading: true,
      };
    }
    case GET_ORDER_SUCCESS: {
      return {
        loading: false,
        success: true,
        fetchedOrder: payload,
      };
    }
    case GET_ORDER_FAILURE: {
      return {
        loading: false,
        fail: true,
        error: payload,
      };
    }
    default:
      return state;
  }
};
