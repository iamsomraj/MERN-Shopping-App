import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  productDetailReducer,
  productListReducer,
} from "./product/productReducers";

const rootReducer = combineReducers({
  productList: productListReducer,
  productDetail: productDetailReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
