import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // logged-in user
  isAuthenticated: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.counterValue += 1;
    },
    decrement: (state, action) => {
      state.counterValue -= 1;
    },
    incrementByVal: (state, action) => {
      state.counterValue += action.payload.value;
    },
  },
});

export const { increment, decrement, incrementByVal } = counterSlice.actions;
export default counterSlice.reducer;
