import { combineReducers } from "redux";
import alertReducer from "./alert/alertReducer";

const rootReducer = combineReducers({
  alert: alertReducer,
});

export default rootReducer;
