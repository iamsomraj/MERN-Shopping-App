import {
  ADMIN_ADD_PRODUCT_FAILURE,
  ADMIN_ADD_PRODUCT_INIT,
  ADMIN_ADD_PRODUCT_REQUEST,
  ADMIN_ADD_PRODUCT_SUCCESS,
  ADMIN_ALL_ORDERS_FAILURE,
  ADMIN_ALL_ORDERS_REQUEST,
  ADMIN_ALL_ORDERS_SUCCESS,
  ADMIN_ALL_USERS_FAILURE,
  ADMIN_ALL_USERS_REQUEST,
  ADMIN_ALL_USERS_SUCCESS,
  ADMIN_DELETE_PRODUCT_FAILURE,
  ADMIN_DELETE_PRODUCT_REQUEST,
  ADMIN_DELETE_PRODUCT_SUCCESS,
  ADMIN_DELETE_USER_FAILURE,
  ADMIN_DELETE_USER_REQUEST,
  ADMIN_DELETE_USER_SUCCESS,
  ADMIN_SINGLE_USER_FAILURE,
  ADMIN_SINGLE_USER_REQUEST,
  ADMIN_SINGLE_USER_SUCCESS,
  ADMIN_UPDATE_USER_FAILURE,
  ADMIN_UPDATE_USER_REQUEST,
  ADMIN_UPDATE_USER_SUCCESS
} from "./adminTypes";

export const adminAllUsersReducer = (state = { users: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_ALL_USERS_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_ALL_USERS_SUCCESS: {
      return {
        loading: false,
        users: payload,
      };
    }
    case ADMIN_ALL_USERS_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const adminSingleUserReducer = (state = { user: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_SINGLE_USER_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_SINGLE_USER_SUCCESS: {
      return {
        loading: false,
        user: payload,
      };
    }
    case ADMIN_SINGLE_USER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const adminUpdateUserReducer = (state = { user: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_UPDATE_USER_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_UPDATE_USER_SUCCESS: {
      return {
        loading: false,
        user: payload,
      };
    }
    case ADMIN_UPDATE_USER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const adminDeleteUserReducer = (state = { user: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_DELETE_USER_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_DELETE_USER_SUCCESS: {
      return {
        loading: false,
        user: payload,
      };
    }
    case ADMIN_DELETE_USER_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const adminDeleteProductReducer = (state = { product: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_DELETE_PRODUCT_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_DELETE_PRODUCT_SUCCESS: {
      return {
        loading: false,
        product: payload,
      };
    }
    case ADMIN_DELETE_PRODUCT_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    default:
      return state;
  }
};

export const adminAddProductReducer = (state = { product: {} }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_ADD_PRODUCT_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_ADD_PRODUCT_SUCCESS: {
      return {
        loading: false,
        success: true,
        product: payload,
      };
    }
    case ADMIN_ADD_PRODUCT_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }
    case ADMIN_ADD_PRODUCT_INIT: {
      return { product: {} };
    }
    default:
      return state;
  }
};

export const adminAllOrdersReducer = (state = { orders: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADMIN_ALL_ORDERS_REQUEST: {
      return {
        loading: true,
      };
    }
    case ADMIN_ALL_ORDERS_SUCCESS: {
      return {
        loading: false,
        orders: payload,
      };
    }
    case ADMIN_ALL_ORDERS_FAILURE: {
      return {
        loading: false,
        error: payload,
      };
    }

    default:
      return state;
  }
};
