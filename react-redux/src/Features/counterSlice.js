import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: {count: 1},
    reducers:{
        addCount: (state)=>{state.count += 1;},
        removeCount: (state)=>{state.count -= 1;},
        resetCount: (state) => {state.count = 0},
    }
});
export const {addCount, removeCount, resetCount} = counterSlice.actions;
export default counterSlice.reducer;