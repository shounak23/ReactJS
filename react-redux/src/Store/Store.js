import { configureStore } from "@reduxjs/toolkit";
import countertReducer from '../Features/counterSlice'

const Store = configureStore({
  reducer: {
    counter: countertReducer,
  },
});

export default Store;