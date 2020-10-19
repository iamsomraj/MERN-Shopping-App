import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  adminAddProductReducer,
  adminAllOrdersReducer,
  adminAllUsersReducer,
  adminDeleteProductReducer,
  adminDeleteUserReducer,
  adminSingleUserReducer,
  adminUpdateUserReducer,
} from "./admin/adminReducers";
import { cartReducer } from "./cart/cartReducers";
import {
  getAllOrdersReducer,
  getOrderReducer,
  payOrderReducer,
  placeOrderReducer,
} from "./order/orderReducers";
import {
  productDetailReducer,
  productListReducer,
} from "./product/productReducers";
import {
  userLoginReducer,
  userProfileReducer,
  userProfileUpdateReducer,
  userRegisterReducer,
} from "./user/userReducers";

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
  userProfile: userProfileReducer,
  userProfileUpdate: userProfileUpdateReducer,
  orderPlace: placeOrderReducer,
  orderGet: getOrderReducer,
  orderPay: payOrderReducer,
  userOrders: getAllOrdersReducer,
  adminAllUsers: adminAllUsersReducer,
  adminSingleUser: adminSingleUserReducer,
  adminUpdate: adminUpdateUserReducer,
  adminDeleteUser: adminDeleteUserReducer,
  adminAddProduct: adminAddProductReducer,
  adminAllOrders: adminAllOrdersReducer,
  adminDeleteProduct: adminDeleteProductReducer,
});

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
