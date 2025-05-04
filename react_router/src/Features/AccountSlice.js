import { createSlice } from "@reduxjs/toolkit";

const AccountSlice = createSlice({
  name: "account",
  initialState: {
    details: [
      {
        name: "",
        id: 0,
        age: 25,
        profession: "",
      },
    ],
    foundPerson: null,
  },
  reducers: {
    addPerson: (state, action) => {
      const person = action.payload;

      state.details.push(person);
    },
    findPerson: (state, action) => {
      debugger;
      const personId = action.payload;

      const person = state.details.find((person) => person.id === personId);
      state.foundPerson = person || null;
    },
  },
});

export const { addPerson, findPerson } = AccountSlice.actions;
export default AccountSlice.reducer;
