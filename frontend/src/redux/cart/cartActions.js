import Axios from "axios";
import { ADD_TO_CART, DELETE_FROM_CART } from "./cartTypes";

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await Axios.get("https://somraj-mern-shop-api.vercel.app/api/products/" + id);
  data.quantity = quantity;
  dispatch({ type: ADD_TO_CART, payload: data });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const deleteItemFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: DELETE_FROM_CART, payload: id });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
