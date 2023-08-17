import { createSlice } from "@reduxjs/toolkit";

// Reducer Name
const name = "counter";

//Initial State
const initialState = {
  value: 0,
};

//Actions
const reducers = {
  _Add(state, action) {
    const { value } = action.payload;
    state.value = state.value + value;
  },
  _Sub(state, action) {
    const { value } = action.payload;
    state.value = state.value - value;
  },
};

//createSlice from reducers
const counterSlice = createSlice({
  name,
  initialState,
  reducers,
});

//Export Reducer Actions
export const { _Add, _Sub } = counterSlice.actions;

//Export Reducer
export default counterSlice.reducer;
