import {
  PLACE_ORDER_REQUEST,
  PLACE_ORDER_SUCCESS,
  PLACE_ORDER_FAILURE,
} from "./orderTypes";
import Axios from "axios";

export const placeMyOrder = (items) => async (dispatch, getState) => {
  try {
    dispatch({ type: PLACE_ORDER_REQUEST });
    const products = items.map((product) => ({
      name: product.name,
      qty: product.quantity,
      price: product.price,
      product: product._id,
    }));
    console.log(products);
    const config = {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getState().userLogin.user.token}`,
      },
    };
    const { data } = await Axios.post("api/orders/", { products }, config);
    dispatch({ type: PLACE_ORDER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PLACE_ORDER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
