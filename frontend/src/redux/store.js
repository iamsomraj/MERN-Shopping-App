import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { cartReducer } from "./cart/cartReducers";
import {
  productDetailReducer,
  productListReducer,
} from "./product/productReducers";
import { userLoginReducer, userRegisterReducer } from "./user/userReducers";

const loadCartItems = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const loadUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : "";

const initialState = {
  cart: {
    cartItems: loadCartItems,
  },
  userLogin: {
    user: loadUser,
  },
  userRegister: {
    user: loadUser,
  },
};

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
});

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
