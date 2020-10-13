import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
  PLACE_ORDER_INIT,
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILURE,
  GET_ALL_ORDERS_SUCCESS,
  GET_ALL_ORDERS_FAILURE,
  GET_ALL_ORDERS_REQUEST,
  PAY_ORDER_REQUEST,
  PAY_ORDER_SUCCESS,
  PAY_ORDER_FAILURE,
  PAY_ORDER_INIT,
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
        error: payload,
      };
    }  
    
    case PLACE_ORDER_INIT: {
      return {
        loading: false,
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

export const getAllOrdersReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_ALL_ORDERS_REQUEST: {
      return {
        loading: true,
      };
    }
    case GET_ALL_ORDERS_SUCCESS: {
      return {
        loading: false,
        success: true,
        orders: payload,
      };
    }
    case GET_ALL_ORDERS_FAILURE: {
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

export const payOrderReducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case PAY_ORDER_REQUEST: {
      return {
        loading: true,
      };
    }
    case PAY_ORDER_SUCCESS: {
      return {
        loading: false,
        success: true,
        order: payload,
      };
    }
    case PAY_ORDER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    case PAY_ORDER_INIT: {
      return {};
    }
    default:
      return state;
  }
};
