import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../Features/AccountSlice";

const Store = configureStore({
  reducer: {
    account: accountReducer,
  },
});

export default Store;