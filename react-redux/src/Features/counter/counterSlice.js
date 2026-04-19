import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  counterValue: 0,
};

export const counterSlice = createSlice({
  name: "counter",
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
