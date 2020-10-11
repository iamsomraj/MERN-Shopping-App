import { ADD_TO_CART, DELETE_FROM_CART } from "./cartTypes";

export const cartReducer = (state = { cartItems: [] }, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TO_CART:
    case DELETE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item._id !== payload),
      };
    default:
      return state;
  }
};
