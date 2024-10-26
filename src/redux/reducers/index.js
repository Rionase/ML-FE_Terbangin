import { combineReducers } from "@reduxjs/toolkit";
import auth from "./auth";
import flight from "./flight";
import history from "./history";
import notification from "./notification";

//combining some reducers
export default combineReducers({ auth, notification, flight, history });
