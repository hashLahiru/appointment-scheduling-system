import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { alertsSlice } from './alertsSlice';
import { usersSlice } from "./usersSlice";

const rootReducer = combineReducers({
    alerts: alertsSlice.reducer,
    user: usersSlice.reducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export default store;