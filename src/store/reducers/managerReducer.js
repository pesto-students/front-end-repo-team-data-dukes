import { createSlice } from "@reduxjs/toolkit";

// Reducer Name
const name = "manager";

//Initial State
const initialState = {
  isAuthorized: false,
  isProfileCompleted: true,
  user: null,
  token: null,
};

//Actions
const reducers = {
  _AuthorizeUI(state, action) {
    Object.keys(action.payload).forEach((key) => {
      state[key] = action.payload[key];
    });
  },
  _ResetUI(state, action) {
    return initialState;
  },
};

//createSlice from reducers
const managerSlice = createSlice({
  name,
  initialState,
  reducers,
});

//Export Reducer Actions
export const { _AuthorizeUI, _ResetUI } = managerSlice.actions;

//Export Reducer
export default managerSlice.reducer;
